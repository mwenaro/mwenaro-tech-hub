'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function InviteTracker() {
    const searchParams = useSearchParams()
    
    useEffect(() => {
        const inviteCode = searchParams.get('invite')
        if (inviteCode) {
            // Set cookie for 30 days
            const d = new Date()
            d.setTime(d.getTime() + (30*24*60*60*1000))
            const expires = "expires="+ d.toUTCString()
            document.cookie = "mwenaro_invite=" + inviteCode + ";" + expires + ";path=/"
            
            // Record the click
            fetch('/api/affiliate/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: inviteCode })
            }).catch(console.error)
        }
    }, [searchParams])

    return null
}
