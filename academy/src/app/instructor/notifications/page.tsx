import { NotificationsList } from '@/components/notifications-list'

export default function InstructorNotificationsPage() {
    return (
        <div className="container py-8 px-4 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tight mb-2 text-orange-600">Instructor Notifications</h1>
                <p className="text-muted-foreground text-lg">Manage your course updates and student interactions.</p>
            </header>

            <NotificationsList />
        </div>
    )
}
