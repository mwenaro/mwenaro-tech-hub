import { createClient } from './supabase/server'

export interface Lesson {
    id: string
    course_id: string
    title: string
    content: string
    order_index: number
    created_at: string
}

export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching lessons:', error)
        return []
    }

    return data as Lesson[]
}

export async function getLesson(lessonId: string): Promise<Lesson | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

    if (error) {
        console.error('Error fetching lesson:', error)
        return null
    }

    return data as Lesson
}
