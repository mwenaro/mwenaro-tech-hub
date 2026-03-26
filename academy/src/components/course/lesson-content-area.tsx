'use client'

import { useState } from 'react'
import { BookOpen, EyeOff } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Mermaid from '@/components/mermaid'
import { LessonQuiz } from './lesson-quiz'

interface Question {
    question_text: string
    options: string[]
    correct_answer: number
    explanation?: string | null
}

interface LessonContentAreaProps {
    content: string
    questions: Question[]
    lessonId: string
    userRole?: 'student' | 'instructor' | 'admin'
    nextLessonHref?: string
}

export function LessonContentArea({
    content,
    questions,
    lessonId,
    userRole,
    nextLessonHref,
}: LessonContentAreaProps) {
    const [quizActive, setQuizActive] = useState(false)
    const [quizDone, setQuizDone] = useState(false)

    const hasQuiz = questions.length > 0

    return (
        <div className="grid grid-cols-1 gap-12">
            {/* Lesson Notes */}
            <div className={`prose prose-zinc lg:prose-xl dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-a:font-bold hover:prose-a:text-primary/80 prose-img:rounded-3xl prose-img:shadow-xl prose-strong:font-black transition-all duration-500 ${quizActive ? 'pointer-events-none select-none' : ''}`}>
                <div className="relative">
                    <div className={`rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/50 p-8 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all duration-500 ${quizActive ? 'blur-sm brightness-75 scale-[0.99]' : ''}`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    if (!inline && match && match[1] === 'mermaid') {
                                        return <Mermaid chart={String(children).replace(/\n$/, '')} />
                                    }
                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                },
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>

                    {/* Quiz active overlay */}
                    {quizActive && (
                        <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-4 z-10">
                            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl px-8 py-6 flex flex-col items-center gap-3 shadow-2xl">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <EyeOff className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-base font-black text-zinc-800 dark:text-zinc-100 tracking-tight">Notes hidden during quiz</p>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest text-center max-w-[200px]">
                                    Complete the quiz to reveal them again
                                </p>
                                {!quizDone && (
                                    <button
                                        onClick={() => setQuizActive(false)}
                                        className="mt-1 flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        View notes (exit quiz)
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quiz & Project */}
            <div className="grid gap-8">
                {hasQuiz && (
                    <LessonQuiz
                        questions={questions}
                        lessonId={lessonId}
                        userRole={userRole}
                        nextLessonHref={nextLessonHref}
                        onQuizStart={() => setQuizActive(true)}
                        onQuizComplete={() => {
                            setQuizDone(true)
                            setQuizActive(false)
                        }}
                    />
                )}
            </div>
        </div>
    )
}
