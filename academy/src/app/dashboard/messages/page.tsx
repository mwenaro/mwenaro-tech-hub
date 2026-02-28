import { MessagingDashboard } from '@/components/messaging-dashboard'

export default function LearnerMessagesPage() {
    return (
        <div className="container py-8 px-4 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tight mb-2 text-orange-600">My Messages</h1>
                <p className="text-muted-foreground">Chat with your instructors and support team.</p>
            </header>

            <MessagingDashboard />
        </div>
    )
}
