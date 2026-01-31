import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle, Clock } from "lucide-react"
import type { Course } from "@/lib/courses"

interface StatsCardsProps {
    courses: (Course & { progress: number })[]
}

export function StatsCards({ courses }: StatsCardsProps) {
    const enrolledCount = courses.length
    const completedCount = courses.filter(c => c.progress === 100).length

    // Mocking active hours roughly based on progress. 
    // Assuming each course is roughly 10 hours for now purely for visual.
    // In a real app, we'd sum up lesson durations.
    const averageProgress = courses.reduce((acc, curr) => acc + curr.progress, 0) / (enrolledCount || 1)
    const activeHours = Math.round((averageProgress / 100) * (enrolledCount * 10))

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Enrolled Courses
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{enrolledCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Active courses
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Completed
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Courses finished
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Hours Learned
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeHours}h</div>
                    <p className="text-xs text-muted-foreground">
                        Total study time
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Average Progress
                    </CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{Math.round(averageProgress)}%</div>
                    <p className="text-xs text-muted-foreground">
                        Across all courses
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
