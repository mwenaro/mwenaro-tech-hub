import { MessagingDashboard } from '@/components/messaging-dashboard'

export default function AdminMessagesPage() {
    return (
        <div className="container py-12 px-4 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tight mb-2 text-red-600 dark:text-red-400">Admin Support Messaging</h1>
                <p className="text-muted-foreground text-lg">Oversee all platform communications and support requests.</p>
            </header>

            <MessagingDashboard />
        </div>
    )
}
