import { createClient } from '@/lib/supabase/server'
import { AffiliateDashboardClient } from './client'
import { ecosystem } from '@mwenaro/config/ecosystem'

export default async function AffiliateDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div className="p-8">Please log in to view this page.</div>

    // Check if user is an affiliate
    const { data: affiliate } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!affiliate) {
        return <AffiliateDashboardClient isAffiliate={false} />
    }

    // Fetch stats
    const { count: clicks } = await supabase
        .from('affiliate_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', affiliate.id)

    const { data: referrals } = await supabase
        .from('affiliate_referrals')
        .select('*, auth:referred_user_id (email)') // wait, auth.users is not accessible unless there's a view. We can use profiles table.
        .eq('affiliate_id', affiliate.id)

    // Actually, join with profiles
    const { data: referralsWithProfiles } = await supabase
        .from('affiliate_referrals')
        .select(`
            id, status, created_at,
            profiles:referred_user_id (full_name)
        `)
        .eq('affiliate_id', affiliate.id)
        .order('created_at', { ascending: false })

    const { data: earnings } = await supabase
        .from('affiliate_earnings')
        .select('amount, status, created_at')
        .eq('affiliate_id', affiliate.id)
        .order('created_at', { ascending: false })

    const { data: withdrawals } = await supabase
        .from('affiliate_withdrawals')
        .select('*')
        .eq('affiliate_id', affiliate.id)
        .order('created_at', { ascending: false })

    const totalEarned = earnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
    const totalWithdrawn = withdrawals?.filter(w => w.status !== 'rejected').reduce((sum, w) => sum + Number(w.amount), 0) || 0
    const pendingWithdrawals = withdrawals?.filter(w => w.status === 'pending').reduce((sum, w) => sum + Number(w.amount), 0) || 0
    const balance = totalEarned - totalWithdrawn

    const stats = {
        clicks: clicks || 0,
        joins: referralsWithProfiles?.length || 0,
        qualified: referralsWithProfiles?.filter(r => r.status === 'qualified').length || 0,
        totalEarned,
        balance,
        pendingWithdrawals,
        link: `${ecosystem.academy}?invite=${affiliate.invite_code}`,
        code: affiliate.invite_code
    }

    return <AffiliateDashboardClient 
        isAffiliate={true} 
        stats={stats} 
        referrals={referralsWithProfiles} 
        earnings={earnings} 
        withdrawals={withdrawals} 
    />
}
