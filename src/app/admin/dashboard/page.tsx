import { getDashboardStats } from '@/lib/admin'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-black tracking-tight mb-2 text-red-600 dark:text-red-500">Admin Command Center</h1>
                    <p className="text-muted-foreground text-lg">Platform Overview & Management</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="p-6">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Total Courses</p>
                        <p className="text-4xl font-black">{stats.totalCourses}</p>
                    </Card>
                    <Card className="p-6">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Total Submissions</p>
                        <p className="text-4xl font-black">{stats.totalSubmissions}</p>
                    </Card>
                    <Card className="p-6">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Platform Revenue (Est)</p>
                        <p className="text-4xl font-black text-green-600">$12,450</p>
                    </Card>
                </div>

                {/* Management Links */}
                <h2 className="text-2xl font-bold mb-6">Management Sections</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/admin/users">
                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500">
                            <h3 className="text-xl font-bold mb-2">User Management</h3>
                            <p className="text-muted-foreground">Promote instructors, manage roles, and view user lists.</p>
                        </Card>
                    </Link>

                    <Link href="/admin/courses">
                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-500">
                            <h3 className="text-xl font-bold mb-2">Course Management</h3>
                            <p className="text-muted-foreground">Add new courses, edit content, and manage curriculum.</p>
                        </Card>
                    </Link>

                    <Link href="/admin/cohorts">
                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-orange-500">
                            <h3 className="text-xl font-bold mb-2">Cohort Management</h3>
                            <p className="text-muted-foreground">Create cohorts, assign instructors, and manage enrollments.</p>
                        </Card>
                    </Link>

                    <Link href="/admin/analytics">
                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-green-500">
                            <h3 className="text-xl font-bold mb-2">AI & Analytics</h3>
                            <p className="text-muted-foreground">Monitor AI grading accuracy, platform trends, and site-wide logs.</p>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
