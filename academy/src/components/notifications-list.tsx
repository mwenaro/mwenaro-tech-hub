'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, ExternalLink, Calendar, MessageSquare, GraduationCap, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getNotifications, markAsRead, markAllAsRead, Notification } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function NotificationsList() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchNotifications()

        // Subscribe to real-time notifications
        const supabase = createClient()
        const channel = supabase
            .channel('public:notifications-full')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications'
            }, (payload) => {
                setNotifications(prev => [payload.new as Notification, ...prev])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchNotifications = async () => {
        setIsLoading(true)
        try {
            const data = await getNotifications()
            setNotifications(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleMarkAsRead = async (id: string) => {
        const success = await markAsRead(id)
        if (success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        }
    }

    const handleMarkAllRead = async () => {
        const success = await markAllAsRead()
        if (success) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'message': return <MessageSquare size={18} className="text-blue-500" />
            case 'session': return <Calendar size={18} className="text-orange-500" />
            case 'review': return <ClipboardCheck size={18} className="text-green-500" />
            case 'system': return <Info size={18} className="text-gray-500" />
            default: return <Bell size={18} className="text-orange-500" />
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="p-6 animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                <div className="h-3 bg-gray-200 rounded w-3/4" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Notifications</h2>
                {notifications.some(n => !n.is_read) && (
                    <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="rounded-xl">
                        Mark all as read
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <Card className="p-12 text-center text-muted-foreground bg-gray-50/50">
                    <Bell className="mx-auto mb-4 text-gray-300" size={48} />
                    <p>No notifications yet.</p>
                </Card>
            ) : (
                notifications.map((n) => (
                    <Card
                        key={n.id}
                        className={`p-6 transition-all border-l-4 ${!n.is_read ? 'border-l-orange-600 bg-orange-50/10' : 'border-l-transparent'}`}
                    >
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center border">
                                {getIcon(n.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold ${!n.is_read ? 'text-orange-950 dark:text-orange-200' : ''}`}>
                                        {n.title}
                                    </h3>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                        {new Date(n.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">{n.content}</p>
                                <div className="flex gap-4 items-center">
                                    {!n.is_read && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMarkAsRead(n.id)}
                                            className="h-8 text-xs font-bold text-orange-600 hover:text-orange-700 p-0"
                                        >
                                            <Check size={14} className="mr-1" /> Mark as read
                                        </Button>
                                    )}
                                    {n.link && (
                                        <Link
                                            href={n.link}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                                        >
                                            View Details <ExternalLink size={14} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </div>
    )
}

function ClipboardCheck({ size, className }: { size: number, className: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="m9 14 2 2 4-4" />
        </svg>
    )
}
