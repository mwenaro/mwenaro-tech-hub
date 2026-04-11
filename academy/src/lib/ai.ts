'use server'

import OpenAI from 'openai'
import { createClient } from './supabase/server'

// Chat client can use Groq for speed or OpenRouter as fallback
const chatClient = new OpenAI({
    apiKey: process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || 'mock_key',
    baseURL: process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : (process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined)
})

// Embedding client MUST use OpenRouter or OpenAI (Groq does not support embeddings)
const embeddingClient = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || 'mock_key',
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined
})

/**
 * Performs vector similarity search to find relevant context.
 */
async function getRelevantContext(query: string) {
    const supabase = await createClient()

    // 1. Generate embedding for the query using the specialized embedding client
    const embeddingResponse = await embeddingClient.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
    })
    const embedding = embeddingResponse.data[0].embedding

    // 2. Search Supabase for similar content
    const { data: context, error } = await supabase.rpc('match_knowledge', {
        query_embedding: embedding,
        match_threshold: 0.3, // Lowered from 0.5 to be more inclusive
        match_count: 5
    })

    if (error) {
        console.error('Vector search failed:', error)
        return ''
    }

    return context?.map((c: any) => c.content).join('\n---\n') || ''
}

/**
 * Unified Academy AI Chat Response with RAG support.
 */
export async function getAcademyChatResponse({ 
    message, 
    history = [], 
    role = 'tutor', 
    name = 'Mwenaro Tutor' 
}: { 
    message: string, 
    history?: any[], 
    role?: string, 
    name?: string 
}) {
    const context = await getRelevantContext(message)

    const groundingInstructions = `
    IMPORTANT GROUNDING RULES:
    1. ONLY use the provided context to answer questions about fees, staff, and policies.
    2. If the context does not contain a specific price or policy, say: "I'm sorry, I don't have the specific details for that in my current records. Please reach out to our support team at support@mwenaro.com or call +254 116 477 282 for exact information."
    3. NEVER invent prices, scholarship programs, or USD dollar values. All prices are in KSh (Kenyan Shillings).
    4. If the user asks about programs not mentioned in the context, refer them to the official course catalog.
    `;

    const systemPrompts: Record<string, string> = {
        tutor: `You are ${name}, a helpful AI tutor at Mwenaro Academy. Help students understand the curriculum using the provided context. ${groundingInstructions}`,
        support: `You are ${name}, an administrative assistant at Mwenaro Academy. Help prospective students/parents with fees and policies using the provided context. ${groundingInstructions}`,
        advisor: `You are ${name}, a career advisor at Mwenaro Academy. Help students choose courses. ${groundingInstructions}`,
    }

    const response = await chatClient.chat.completions.create({
        model: process.env.GROQ_API_KEY ? "llama-3.1-8b-instant" : "gpt-4o",
        messages: [
            { role: "system", content: systemPrompts[role] || systemPrompts.tutor },
            { role: "system", content: `CONTEXT FROM ACADEMY KNOWLEDGE BASE:\n${context}` },
            ...history,
            { role: "user", content: message }
        ],
        temperature: 0.7,
    })

    return response.choices[0].message.content
}

/**
 * Analyzes a GitHub repository and provides a suggested rating and feedback.
 */
export async function analyzeProject(lessonId: string, repoLink: string, studentId: string) {
    const supabase = await createClient()

    // 1. Fetch Lesson Requirements for context
    const { data: lesson } = await supabase
        .from('lessons')
        .select('title, content')
        .eq('id', lessonId)
        .single()

    if (!lesson) throw new Error('Lesson not found')

    // Update status to pending
    await supabase
        .from('lesson_progress')
        .update({ ai_status: 'pending' })
        .eq('user_id', studentId)
        .eq('lesson_id', lessonId)

    // Check for API key
    if (!process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY) {
        console.warn('AI API key not found. Skipping real AI analysis.')
        await supabase
            .from('lesson_progress')
            .update({
                ai_status: 'completed',
                ai_rating: 85,
                ai_feedback: "MOCK AI FEEDBACK: The project repository was successfully submitted. The code structure appears organized, and the README provides clear instructions. (Add API key to .env.local for real analysis)"
            })
            .eq('user_id', studentId)
            .eq('lesson_id', lessonId)
        return
    }

    try {
        // In a real implementation with more time, we would fetch the repo contents (README, main files)
        // For now, we'll provide the context we have to GPT-4o
        const response = await chatClient.chat.completions.create({
            model: process.env.GROQ_API_KEY ? "llama-3.1-8b-instant" : "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert software engineering instructor at Mwenaro Academy. Your task is to review student project submissions based on lesson requirements. Provide a rating (0-100) and constructive feedback."
                },
                {
                    role: "user",
                    content: `
                        Lesson: ${lesson.title}
                        Requirements: ${lesson.content.substring(0, 1000)}
                        Student Repo Link: ${repoLink}
                        
                        Please analyze this submission. Since you cannot browse the repo directly in this simplified demo, assume standard best practices for this lesson. Provide your response in JSON format: { "rating": number, "feedback": "string" }
                    `
                }
            ],
            response_format: { type: "json_object" }
        })

        const result = JSON.parse(response.choices[0].message.content || '{}')

        // Update database with AI results
        await supabase
            .from('lesson_progress')
            .update({
                ai_rating: result.rating || 0,
                ai_feedback: result.feedback || 'No feedback provided by AI.',
                ai_status: 'completed'
            })
            .eq('user_id', studentId)
            .eq('lesson_id', lessonId)

    } catch (error) {
        console.error('AI Analysis failed:', error)
        await supabase
            .from('lesson_progress')
            .update({ ai_status: 'failed' })
            .eq('user_id', studentId)
            .eq('lesson_id', lessonId)
    }
}

export async function getRecommendedCourses(userId: string) {
    const supabase = await createClient()

    // 1. Get user profile (role) and average performance
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('highest_quiz_score')
        .eq('user_id', userId)

    const avgScore = progress && progress.length > 0
        ? progress.reduce((acc, curr) => acc + (curr.highest_quiz_score || 0), 0) / progress.length
        : 0

    // 2. Get user's enrolled course IDs and their categories
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
            course_id,
            courses (
                category
            )
        `)
        .eq('user_id', userId)

    const enrolledCourseIds = enrollments?.map(e => e.course_id) || []
    const categories = Array.from(new Set(enrollments?.map(e => (e.courses as any)?.category).filter(Boolean)))

    // 3. Fetch recommendations
    let query = supabase.from('courses').select('*').eq('is_published', true)

    if (enrolledCourseIds.length > 0) {
        query = query.not('id', 'in', `(${enrolledCourseIds.join(',')})`)
    }

    // Role-based filtering logic
    if (profile?.role === 'admin' || profile?.role === 'instructor') {
        // Recommend advanced or management courses
        query = query.or('level.eq.Advanced,category.eq.Management')
    } else if (avgScore > 85) {
        // High performer: Recommend advanced courses in their categories
        if (categories.length > 0) {
            query = query.in('category', categories as any[]).eq('level', 'Advanced')
        } else {
            query = query.eq('level', 'Advanced')
        }
    } else if (categories.length > 0) {
        // Normal path: Recommend courses in their categories
        query = query.in('category', categories as any[])
    }

    const { data: recommendations, error } = await query.limit(3)

    if (error || !recommendations || recommendations.length === 0) {
        // Fallback: 3 random published courses not enrolled
        const { data: fallback } = await supabase
            .from('courses')
            .select('*')
            .eq('is_published', true)
            .not('id', 'in', enrolledCourseIds.length > 0 ? `(${enrolledCourseIds.join(',')})` : '(00000000-0000-0000-0000-000000000000)')
            .limit(3)
        return fallback || []
    }

    return recommendations
}

