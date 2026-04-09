import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInstructorStudents, getCohortAnalytics } from '@/lib/instructor'
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
    if (role !== 'instructor' && role !== 'admin') {
        redirect('/dashboard')
    }

    const [students, analytics] = await Promise.all([
        getInstructorStudents(user.id),
        getCohortAnalytics()
    ])

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                                Academy Pulse
                            </h1>
                        </div>
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest ml-1">
                            Cohort Health Monitoring & Individual Mastery Tracking
                        </p>
                    </div>
                    <Link href={role === 'admin' ? '/admin' : '/instructor/dashboard'}>
                        <Button variant="ghost" className="font-bold h-12 px-6 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Hub
                        </Button>
                    </Link>
                </div>

                <StudentDirectoryClient initialStudents={students} initialAnalytics={analytics} />
            </div>
        </div>
    )
}
