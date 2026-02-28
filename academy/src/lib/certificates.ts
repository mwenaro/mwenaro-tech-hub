'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'

export interface Certificate {
    id: string
    user_id: string
    course_id: string
    full_name: string
    course_title: string
    issued_at: string
}

export async function getCertificates(): Promise<Certificate[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false })

    if (error) {
        console.error('Error fetching certificates:', error)
        return []
    }

    return data as Certificate[]
}

export async function issueCertificate(courseId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: 'User not authenticated' }

    // 1. Check eligibility (100% completion)
    // Fetch lessons for course
    const { data: lessons } = await supabase.from('lessons').select('id').eq('course_id', courseId)
    const lessonIds = lessons?.map(l => l.id) || []

    if (lessonIds.length === 0) return { success: false, message: 'Course has no lessons' }

    // Fetch progress
    const { count: completedCount } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .in('lesson_id', lessonIds)

    if ((completedCount || 0) < lessonIds.length) {
        return { success: false, message: 'Course not yet completed' }
    }

    // 2. Fetch course and user details for the certificate
    const { data: course } = await supabase.from('courses').select('title').eq('id', courseId).single()
    const fullName = user.user_metadata?.full_name || 'Mwenaro Student'

    // 3. Issue certificate
    const { data, error } = await supabase
        .from('certificates')
        .upsert({
            user_id: user.id,
            course_id: courseId,
            full_name: fullName,
            course_title: course?.title || 'Unknown Course'
        }, { onConflict: 'user_id,course_id' })
        .select()
        .single()

    if (error) {
        console.error('Error issuing certificate:', error)
        return { success: false, message: 'Failed to issue certificate' }
    }

    revalidatePath('/dashboard/certificates')
    return { success: true, certificate: data }
}

export async function checkCertificateEligibility(courseId: string): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: lessons } = await supabase.from('lessons').select('id').eq('course_id', courseId)
    const lessonIds = lessons?.map(l => l.id) || []
    if (lessonIds.length === 0) return false

    const { count: completedCount } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .in('lesson_id', lessonIds)

    return (completedCount || 0) >= lessonIds.length
}
