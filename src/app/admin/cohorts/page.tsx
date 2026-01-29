import { getAllCohorts, getInstructors, getAllUsers } from '@/lib/admin'
import { getCourses } from '@/lib/courses'
import { Card } from '@/components/ui/card'
import { CreateCohortForm } from '@/components/create-cohort-form'
import { AssignStudentForm } from '@/components/assign-student-form'
// import { CreateCohortForm } from '@/components/create-cohort-form'
// import { AssignStudentForm } from '@/components/assign-student-form'

export default async function CohortsPage() {
    const cohorts = await getAllCohorts()
    const instructors = await getInstructors()
    const courses = await getCourses()
    const allUsers = await getAllUsers()
    const students = allUsers.filter(u => u.role === 'student')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-black text-orange-600 dark:text-orange-400 mb-8">Cohort Management</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cohorts List */}
                    <div className="lg:col-span-2 space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-4">Active Cohorts</h2>
                            {cohorts.length === 0 ? (
                                <Card className="p-12 text-center text-muted-foreground">
                                    No cohorts created yet.
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {cohorts.map((cohort: any) => (
                                        <Card key={cohort.id} className="p-6 border-l-4 border-l-orange-500">
                                            <div className="text-xs font-bold text-muted-foreground uppercase mb-1">
                                                {cohort.courses?.title}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{cohort.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                Instructor ID: {cohort.instructor_id.split('-')[0]}...
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Forms */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">Create New Cohort</h2>
                            <CreateCohortForm courses={courses} instructors={instructors} />
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">Assign Student to Cohort</h2>
                            <AssignStudentForm students={students} cohorts={cohorts} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
