'use client'

import { useState } from 'react'
import { createCohort } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface CreateCohortFormProps {
    courses: { id: string, title: string }[]
    instructors: { id: string, email: string }[]
}

export function CreateCohortForm({ courses, instructors }: CreateCohortFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            course_id: formData.get('course_id') as string,
            instructor_id: formData.get('instructor_id') as string,
        }

        try {
            await createCohort(data)
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
                <label className="text-sm font-medium mb-1 block">Cohort Name</label>
                <input
                    name="name"
                    placeholder="e.g. React Summer 2026"
                    required
                    className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Course</label>
                <select
                    name="course_id"
                    required
                    className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Instructor</label>
                <select
                    name="instructor_id"
                    required
                    className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">Select Instructor</option>
                    {instructors.map(i => <option key={i.id} value={i.id}>{i.email}</option>)}
                </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700">
                {isSubmitting ? 'Creating...' : 'Create Cohort'}
            </Button>
        </form>
    )
}
