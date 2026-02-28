'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Course } from './courses'

export async function enrollUser(courseId: string, paymentIdOrFormData?: string | FormData): Promise<void> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        if (typeof paymentIdOrFormData !== 'string') {
            redirect('/login')
        }
        return
    }

    const paymentId = typeof paymentIdOrFormData === 'string' ? paymentIdOrFormData : undefined

    // Check if already enrolled
    const isEnrolled = await hasEnrolled(courseId)
    if (isEnrolled) {
        if (typeof paymentIdOrFormData !== 'string') {
            redirect('/dashboard')
        }
        return
    }

    // Verify course is free or payment is provided
    const { data: course } = await supabase.from('courses').select('price').eq('id', courseId).single()
    if (course && course.price > 0 && !paymentId) {
        if (typeof paymentIdOrFormData !== 'string') {
            // In a real app, we'd handle this with useActionState for UI feedback
            redirect(`/checkout/${courseId}`)
        }
        return
    }

    const { error } = await supabase
        .from('enrollments')
        .insert({
            user_id: user.id,
            course_id: courseId,
        })

    if (error) {
        console.error('Error enrolling user:', error)
        // If it's a webhook, we might want to throw to trigger retry or log
        if (typeof paymentIdOrFormData === 'string') {
            throw new Error('Failed to enroll student')
        }
        return
    }

    revalidatePath(`/courses/${courseId}`)
    revalidatePath('/dashboard')

    if (typeof paymentIdOrFormData !== 'string') {
        redirect('/dashboard')
    }
}

export async function hasEnrolled(courseId: string): Promise<boolean> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return false
    }

    const { data, error } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Relation not found" or "No rows found" depending on context, usually no rows for single()
        // actually for .single(), if no row is found it returns an error.
        return false
    }

    return !!data
}

export async function getEnrolledCourses(): Promise<Course[]> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('enrollments')
        .select(`
            course_id,
            courses (*)
        `)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching enrolled courses:', error)
        return []
    }

    return data
        .map((enrollment: any) => enrollment.courses)
        .filter(Boolean) as Course[]
}
