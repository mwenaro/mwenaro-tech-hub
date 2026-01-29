'use client'

import { useState } from 'react'
import { assignStudentToCohort } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface AssignStudentFormProps {
    students: { id: string, email: string }[]
    cohorts: { id: string, name: string, course_id: string }[]
}

export function AssignStudentForm({ students, cohorts }: AssignStudentFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const studentId = formData.get('student_id') as string
        const cohortId = formData.get('cohort_id') as string

        const cohort = cohorts.find(c => c.id === cohortId)
        if (!cohort) return

        try {
            await assignStudentToCohort(studentId, cohort.course_id, cohortId)
            const form = e.target as HTMLFormElement
            form.reset()
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-1 block">Student</label>
                <select
                    name="student_id"
                    required
                    className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.email}</option>)}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Cohort</label>
                <select
                    name="cohort_id"
                    required
                    className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">Select Cohort</option>
                    {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? 'Assigning...' : 'Assign Student'}
            </Button>
        </form>
    )
}
