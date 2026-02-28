import { NotificationsList } from '@/components/notifications-list'

export default function AdminNotificationsPage() {
    return (
        <div className="container py-8 px-4 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tight mb-2 text-red-600">Admin System Notifications</h1>
                <p className="text-muted-foreground text-lg">Monitor platform alerts and system notifications.</p>
            </header>

            <NotificationsList />
        </div>
    )
}
