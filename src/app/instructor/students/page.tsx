import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInstructorStudents } from '@/lib/instructor'
import { StudentDirectoryClient } from '@/components/student-directory-client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users } from 'lucide-react'

export default async function InstructorStudentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const role = user.user_metadata?.role || 'student'
    if (role !== 'instructor') {
        redirect('/dashboard')
    }

    const students = await getInstructorStudents(user.id)

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Class Directory</h1>
                        </div>
                        <p className="text-zinc-500 font-medium ml-1">Manage your student roster and track enrollment activity.</p>
                    </div>
                    <Link href="/instructor/dashboard">
                        <Button variant="ghost" className="font-bold h-12 px-6 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Hub
                        </Button>
                    </Link>
                </div>

                <StudentDirectoryClient initialStudents={students} />
            </div>
        </div>
    )
}
