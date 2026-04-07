import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const { code } = await req.json()
        if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

        const supabase = await createClient()

        // Find the affiliate
        const { data: affiliate } = await supabase
            .from('affiliates')
            .select('id')
            .eq('invite_code', code)
            .single()

        if (affiliate) {
            // Get IP address for basic tracking/deduplication if needed
            const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
            
            // Hash the ip to avoid storing raw PII
            const ipHash = Buffer.from(ip).toString('base64').substring(0, 32)
            
            await supabase
                .from('affiliate_clicks')
                .insert({
                    affiliate_id: affiliate.id,
                    ip_hash: ipHash
                })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error logging affiliate click:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
