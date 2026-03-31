'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, ChevronRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { submitQuiz, LessonProgress, requestRetrial } from '@/lib/progress'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Question {
    question_text: string
    options: string[]
    correct_answer: number
    explanation?: string | null
}

interface LessonQuizProps {
    questions: Question[]
    nextLessonHref?: string
    lessonId?: string // Optional for production tracking
    onSuccess?: (score: number) => void // Callback for production gating
    userRole?: 'student' | 'instructor' | 'admin'
    onQuizStart?: () => void   // Called when student clicks "Take Module Quiz"
    onQuizComplete?: () => void // Called when quiz is fully submitted (any score)
    initialProgress?: LessonProgress
}

export function LessonQuiz({ questions, nextLessonHref, lessonId, onSuccess, userRole, onQuizStart, onQuizComplete, initialProgress }: LessonQuizProps) {
    const router = useRouter()
    const [isStarted, setIsStarted] = useState(false)
    const [userAnswers, setUserAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [quizProgress, setQuizProgress] = useState<LessonProgress | undefined>(initialProgress)
    const [isRequestingRetrial, setIsRequestingRetrial] = useState(false)

    const attempts = quizProgress?.quiz_attempts || 0
    const extraAttempts = quizProgress?.extra_attempts_granted || 0
    const maxAttempts = 3 + extraAttempts
    const retrialRequested = quizProgress?.retrial_requested || false
    const highestScore = quizProgress?.highest_quiz_score || 0
    const isCompleted = quizProgress?.is_completed || false

    const isInstructor = userRole === 'instructor'

    const allCorrect = submitted && userAnswers.every((ans, idx) => ans === questions[idx].correct_answer)

    const handleOptionSelect = (qIdx: number, oIdx: number) => {
        if (submitted) return
        const newAnswers = [...userAnswers]
        newAnswers[qIdx] = oIdx
        setUserAnswers(newAnswers)
    }

    const handleSubmit = async () => {
        if (userAnswers.includes(-1)) return

        setIsSubmitting(true)
        setError(null)

        try {
            if (lessonId && !isInstructor) {
                // Production Mode: Submit to DB
                const res = await submitQuiz(lessonId, userAnswers)
                if (res.success) {
                    setSubmitted(true)
                    onQuizComplete?.()

                    // Update local progress state to reflect new attempt
                    setQuizProgress(prev => prev ? {
                        ...prev,
                        quiz_attempts: (prev.quiz_attempts || 0) + 1,
                        highest_quiz_score: Math.max(prev.highest_quiz_score || 0, res.score),
                        is_completed: res.passed || (prev.quiz_attempts + 1 >= 5),
                        retrial_requested: false
                    } : undefined)

                    if (res.passed && onSuccess) {
                        onSuccess(res.score)
                    }
                } else {
                    setError(res.message)
                }
            } else {
                // Vetting/Instructor Mode: Client-side validation only
                setSubmitted(true)
                onQuizComplete?.()
            }
        } catch (e) {
            console.error('Quiz submission error:', e)
            setError('Failed to submit quiz. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRetry = () => {
        if (attempts >= maxAttempts) return
        setUserAnswers(new Array(questions.length).fill(-1))
        setSubmitted(false)
        setError(null)
        onQuizStart?.()
    }

    const handleRequestRetrial = async () => {
        if (!lessonId) return
        setIsRequestingRetrial(true)
        try {
            const res = await requestRetrial(lessonId)
            if (res.success) {
                setQuizProgress(prev => prev ? { ...prev, retrial_requested: true } : prev)
                toast.success('Retrial requested! Please wait for instructor approval.')
            } else {
                toast.error(res.message)
            }
        } catch (e) {
            toast.error('Failed to request retrial')
        } finally {
            setIsRequestingRetrial(false)
        }
    }

    if (!isStarted) {
        return (
            <div className="pt-12 border-t border-zinc-200 dark:border-zinc-800">
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-10 border border-zinc-200/50 dark:border-zinc-800/50 text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                        <HelpCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">Knowledge Check</h2>
                        <div className="flex flex-col items-center gap-1 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                                {attempts} of {maxAttempts} Attempts Used
                            </span>
                        </div>
                        <p className="text-zinc-500 font-bold max-w-sm mx-auto">
                            Complete this quick quiz to verify your understanding and unlock the next module.
                        </p>
                    </div>

                    {attempts >= maxAttempts && !isCompleted ? (
                        <div className="space-y-4">
                            {!retrialRequested ? (
                                <button
                                    onClick={handleRequestRetrial}
                                    disabled={isRequestingRetrial}
                                    className="px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-lg rounded-2xl hover:opacity-90 transition-all hover:-translate-y-1 shadow-2xl"
                                >
                                    {isRequestingRetrial ? 'Requesting...' : 'Request 2 More Attempts'}
                                </button>
                            ) : (
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold">
                                    Retrial requested! Please wait for instructor approval.
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => { setIsStarted(true); onQuizStart?.() }}
                            className="px-10 py-4 bg-primary text-white font-black text-lg rounded-2xl hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-2xl shadow-primary/30"
                        >
                            {isCompleted ? 'Review Module Quiz' : 'Take Module Quiz'}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <section className="space-y-8 pt-12 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Knowledge Check</h2>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Answer correctly to unlock the next module</p>
                </div>
            </div>

            <div className="grid gap-6">
                {questions.map((q, qIdx) => {
                    const isCorrect = userAnswers[qIdx] === q.correct_answer
                    const isWrong = submitted && !isCorrect && userAnswers[qIdx] !== -1

                    return (
                        <div key={qIdx} className={`rounded-3xl border transition-all duration-300 ${submitted
                            ? (isCorrect ? 'border-green-500/30 bg-green-500/[0.02]' : 'border-red-500/30 bg-red-500/[0.02]')
                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm'
                            } p-8 space-y-6`}>
                            <div className="flex items-start gap-4">
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${submitted
                                    ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                                    : 'bg-zinc-100 dark:bg-zinc-800'
                                    }`}>
                                    {qIdx + 1}
                                </span>
                                <h3 className="text-xl font-bold leading-snug">{q.question_text}</h3>
                            </div>

                            <div className="grid gap-3 ml-12">
                                {q.options.map((opt, oIdx) => {
                                    const isSelected = userAnswers[qIdx] === oIdx
                                    const showAsCorrect = submitted && oIdx === q.correct_answer
                                    const showAsWrong = submitted && isSelected && !isCorrect

                                    return (
                                        <button
                                            key={oIdx}
                                            disabled={submitted}
                                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                                            className={`p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-all ${isSelected && !submitted ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                                                } ${showAsCorrect ? 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400' : ''
                                                } ${showAsWrong ? 'bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-400' : ''
                                                } ${!isSelected && !showAsCorrect ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600' : ''
                                                } ${submitted && !isSelected && !showAsCorrect ? 'opacity-40' : ''}`}
                                        >
                                            <span className="font-bold">{opt}</span>
                                            {showAsCorrect && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                                            {showAsWrong && <XCircle className="w-5 h-5 flex-shrink-0" />}
                                        </button>
                                    )
                                })}
                            </div>

                            {submitted && !isCorrect && (
                                <div className="ml-12 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 transition-all animate-in fade-in slide-in-from-top-2">
                                    <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Keep trying!</p>
                                    <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed font-bold">
                                        Check the lesson notes again. {q.explanation}
                                    </p>
                                </div>
                            )}

                            {submitted && isCorrect && (
                                <div className="ml-12 p-4 rounded-2xl bg-green-500/5 border border-green-500/10 transition-all animate-in fade-in slide-in-from-top-2">
                                    <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Correct Answer</p>
                                    <p className="text-sm text-green-600 dark:text-green-400 leading-relaxed font-bold">
                                        {q.explanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="flex flex-col items-center gap-6 pt-8">
                {isInstructor && (
                    <div className="w-full p-4 rounded-xl bg-primary/5 border border-primary/20 text-primary font-bold text-center italic mb-4">
                        Instructor Preview: Quizzes are client-side only. Progress is not saved.
                    </div>
                )}

                {error && (
                    <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 font-bold text-center mb-4">
                        {error}
                    </div>
                )}

                {!allCorrect ? (
                    <div className="w-full space-y-4 max-w-md mx-auto">
                        {attempts < maxAttempts ? (
                            <button
                                onClick={handleSubmit}
                                disabled={userAnswers.includes(-1) || isSubmitting}
                                className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl ${(userAnswers.includes(-1) || isSubmitting)
                                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                                    : 'bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5 shadow-primary/20'
                                    }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        ) : (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 font-bold text-center">
                                Max attempts reached. {retrialRequested ? 'Wait for approval.' : 'Request more below.'}
                            </div>
                        )}

                        {submitted && attempts < maxAttempts && (
                            <button
                                onClick={handleRetry}
                                className="w-full py-3 text-zinc-500 font-bold hover:text-primary transition-colors text-sm uppercase tracking-widest"
                            >
                                Try Again to Unlock Next Lesson
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="w-full max-w-md mx-auto space-y-6 animate-in zoom-in duration-500">
                        {/* Status Card: Different for Passed vs. Failed-but-Completed */}
                        <div className={cn(
                            "rounded-2xl p-6 text-center border",
                            highestScore >= 70
                                ? "bg-green-500/10 border-green-500/20"
                                : "bg-amber-500/10 border-amber-500/20"
                        )}>
                            {highestScore >= 70 ? (
                                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            ) : (
                                <HelpCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                            )}

                            <h3 className={cn(
                                "text-xl font-black",
                                highestScore >= 70 ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"
                            )}>
                                {highestScore >= 70 ? "Excellent!" : "Keep Growing!"}
                            </h3>

                            <p className={cn(
                                "font-bold",
                                highestScore >= 70 ? "text-green-600 dark:text-green-500" : "text-amber-600 dark:text-amber-500"
                            )}>
                                {highestScore >= 70
                                    ? "You've mastered this module."
                                    : "Don't worry! We've recorded your effort. You can now proceed to the next module."
                                }
                            </p>
                        </div>

                        {nextLessonHref ? (
                            <Link
                                href={nextLessonHref}
                                className="flex items-center justify-center gap-2 w-full py-5 bg-primary text-white font-black text-xl rounded-2xl hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-2xl shadow-primary/30"
                            >
                                Next Lesson
                                <ChevronRight className="w-6 h-6" />
                            </Link>
                        ) : (
                            <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-center">
                                <p className="font-black text-zinc-500 uppercase tracking-widest">End of Track</p>
                                <p className="text-sm font-bold mt-1 text-zinc-400">You've completed all modules!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
