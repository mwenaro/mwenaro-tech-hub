import { Card } from '@/components/ui/card'

export default function AnalyticsPage() {
    const mockLogs = [
        { id: 1, student: 'student@example.com', lesson: 'React Hooks', ai_rating: 85, instructor_adjustment: 0, date: '2026-03-25' },
        { id: 2, student: 'dev@example.com', lesson: 'Next.js App Router', ai_rating: 92, instructor_adjustment: -2, date: '2026-03-24' },
        { id: 3, student: 'bob@example.com', lesson: 'TypeScript Basics', ai_rating: 70, instructor_adjustment: +5, date: '2026-03-23' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-8">AI & Platform Analytics</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">AI Grading Accuracy</h2>
                        <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '94%' }}></div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">94% of AI grades were accepted by instructors without change.</p>
                    </Card>
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Project Submission Trend</h2>
                        <p className="text-4xl font-black text-blue-600">+150% <span className="text-sm font-normal text-muted-foreground">this month</span></p>
                    </Card>
                </div>

                <Card className="overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="text-left p-4">Student</th>
                                <th className="text-left p-4">Lesson</th>
                                <th className="text-left p-4">AI Rating</th>
                                <th className="text-left p-4">Adjustment</th>
                                <th className="text-left p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {mockLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="p-4">{log.student}</td>
                                    <td className="p-4">{log.lesson}</td>
                                    <td className="p-4 font-bold">{log.ai_rating}%</td>
                                    <td className={`p-4 font-bold ${log.instructor_adjustment > 0 ? 'text-green-600' : log.instructor_adjustment < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                        {log.instructor_adjustment > 0 ? `+${log.instructor_adjustment}` : log.instructor_adjustment}
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">{log.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    )
}
