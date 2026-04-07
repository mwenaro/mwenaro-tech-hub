import { createAdminClient } from './supabase/admin'

export async function processAffiliateSignup(inviteCode: string, newUserId: string) {
    if (!inviteCode || !newUserId) return

    const adminClient = createAdminClient()

    // 1. Find the affiliate by invite code
    const { data: affiliate } = await adminClient
        .from('affiliates')
        .select('id')
        .eq('invite_code', inviteCode)
        .eq('status', 'active')
        .single()

    if (!affiliate) return

    // 2. Link the referral
    await adminClient
        .from('affiliate_referrals')
        .insert({
            affiliate_id: affiliate.id,
            referred_user_id: newUserId,
            status: 'pending_payment'
        })
}

/**
 * Called by M-Pesa/Stripe webhooks upon successful payment
 */
export async function assessAffiliateReward(userId: string, courseId: string) {
    const adminClient = createAdminClient()

    // 1. Check if user is an active referral awaiting payout
    const { data: referral } = await adminClient
        .from('affiliate_referrals')
        .select('*, affiliates(id, status)')
        .eq('referred_user_id', userId)
        .eq('status', 'pending_payment')
        .single()

    if (!referral || referral.affiliates?.status !== 'active') return

    // 2. We don't want to double reward for multiple course payments if the first one triggered it.
    // Wait, the logic is "one earns 2k fater their referral people pay a depost of min 40% of total feefs." 
    // Usually means ONCE total. Or once per course? The prompt says "after their referral people pay a deposit".
    // I will assume it's ONCE total for the referred person. Let's make sure this referral wasn't already paid.
    // The `status` is 'pending_payment', so it wasn't paid.

    // 3. Get course price
    const { data: course } = await adminClient
        .from('courses')
        .select('price')
        .eq('id', courseId)
        .single()

    if (!course || !course.price) return

    // 4. Sum up all payments made by this user for ANY or THIS course? The prompt says "40% of total fees".
    // Let's sum course_payments for THIS course.
    const { data: payments } = await adminClient
        .from('course_payments')
        .select('amount')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('status', 'completed')

    const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
    const currentPrice = Number(course.price)
    
    if (totalPaid >= currentPrice * 0.40) {
        // Threshold met!
        // Upgrade referral status
        await adminClient
            .from('affiliate_referrals')
            .update({ status: 'qualified' })
            .eq('id', referral.id)

        // Insert Earnings of 2,000
        await adminClient
            .from('affiliate_earnings')
            .insert({
                affiliate_id: referral.affiliate_id,
                referral_id: referral.id,
                course_id: courseId,
                amount: 2000,
                status: 'pending_withdrawal'
            })
    }
}
