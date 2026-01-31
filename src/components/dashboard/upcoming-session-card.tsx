import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, Users } from "lucide-react"
import { format } from "date-fns"

interface UpcomingSessionCardProps {
    id: string
    title: string
    courseName?: string
    scheduledAt: Date | string
    durationMinutes: number
    instructorName?: string
    meetingUrl?: string | null
}

export function UpcomingSessionCard({
    title,
    courseName,
    scheduledAt,
    durationMinutes,
    instructorName,
    meetingUrl,
}: UpcomingSessionCardProps) {
    const sessionDate = new Date(scheduledAt)
    const isToday = new Date().toDateString() === sessionDate.toDateString()
    const isUpcoming = sessionDate > new Date()

    return (
        <Card className={`border-border ${isToday ? "ring-2 ring-primary/20" : ""}`}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            {isToday && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                    Today
                                </span>
                            )}
                            {courseName && <span className="text-xs text-muted-foreground">{courseName}</span>}
                        </div>
                        <h3 className="font-semibold text-foreground truncate">{title}</h3>

                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{format(sessionDate, "EEEE, MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {format(sessionDate, "h:mm a")} • {durationMinutes} min
                                </span>
                            </div>
                            {instructorName && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>with {instructorName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">
                                {format(sessionDate, "h:mm")}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase">
                                {format(sessionDate, "a")}
                            </p>
                        </div>
                        {isUpcoming && meetingUrl && (
                            <Button size="sm" className="mt-2 text-xs h-8" asChild>
                                <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
                                    <Video className="mr-2 h-4 w-4" />
                                    Join
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
