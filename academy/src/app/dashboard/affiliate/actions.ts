'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function joinAffiliateProgram() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    // Generate non-obvious code format, e.g. JOIN-7B2K9X
    const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase()
    const inviteCode = `WIN-${randomHash}`

    const { error } = await supabase
        .from('affiliates')
        .insert({
            user_id: user.id,
            invite_code: inviteCode
        })

    if (error) {
        console.error('Error creating affiliate profile:', error)
        return { error: 'Failed to join program. Try again.' }
    }

    revalidatePath('/dashboard/affiliate')
    return { success: true }
}

export async function requestWithdrawal(amount: number, mpesaNumber: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { data: affiliate } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!affiliate) return { error: 'Not an affiliate' }

    // Validate balance
    const { data: earnings } = await supabase
        .from('affiliate_earnings')
        .select('amount, status')
        .eq('affiliate_id', affiliate.id)

    const { data: withdrawals } = await supabase
        .from('affiliate_withdrawals')
        .select('amount, status')
        .eq('affiliate_id', affiliate.id)

    const totalEarned = earnings?.filter(e => e.status !== 'failed').reduce((sum, e) => sum + Number(e.amount), 0) || 0
    const totalWithdrawn = withdrawals?.filter(w => w.status !== 'rejected').reduce((sum, w) => sum + Number(w.amount), 0) || 0
    const availableBalance = totalEarned - totalWithdrawn

    if (amount > availableBalance || amount <= 0) {
        return { error: 'Invalid withdrawal amount' }
    }

    const { error } = await supabase
        .from('affiliate_withdrawals')
        .insert({
            affiliate_id: affiliate.id,
            amount,
            mpesa_number: mpesaNumber,
            status: 'pending'
        })

    if (error) {
        console.error('Withdrawal error:', error)
        return { error: 'Failed to request withdrawal' }
    }

    revalidatePath('/dashboard/affiliate')
    return { success: true }
}
