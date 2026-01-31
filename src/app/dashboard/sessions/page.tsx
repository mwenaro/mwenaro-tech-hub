import { getStudentSessions } from '@/lib/sessions'
import { UpcomingSessionCard } from '@/components/dashboard/upcoming-session-card'
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default async function DashboardSessionsPage() {
    const upcomingSessions = await getStudentSessions()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Upcoming Sessions</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingSessions.length === 0 ? (
                    <Card className="col-span-full border-dashed">
                        <CardContent className="py-12 text-center">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">No upcomings sessions</h3>
                            <p className="text-muted-foreground">
                                Check back later for new scheduled sessions.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    upcomingSessions.map((session) => (
                        <UpcomingSessionCard
                            key={session.id}
                            id={session.id}
                            title={session.title}
                            courseName={session.cohort?.name}
                            scheduledAt={session.start_time}
                            durationMinutes={session.duration_minutes}
                            meetingUrl={session.meeting_link}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
