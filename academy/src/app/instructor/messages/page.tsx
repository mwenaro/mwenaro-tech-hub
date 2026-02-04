import { MessagingDashboard } from '@/components/messaging-dashboard'

export default function InstructorMessagesPage() {
    return (
        <div className="container py-12 px-4 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tight mb-2">Instructor Messaging</h1>
                <p className="text-muted-foreground text-lg">Communicate directly with your students across all cohorts.</p>
            </header>

            <MessagingDashboard />
        </div>
    )
}
