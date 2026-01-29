'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitProject } from '@/lib/progress'

interface ProjectSubmissionProps {
    lessonId: string
    isCompleted: boolean
    existingLink?: string | null
    quizRequired?: boolean
    quizPassed?: boolean
    isReviewed?: boolean
    rating?: number | null
    feedback?: string | null
}

export function ProjectSubmission({
    lessonId,
    isCompleted,
    existingLink,
    quizRequired = false,
    quizPassed = false,
    isReviewed = false,
    rating = null,
    feedback = null
}: ProjectSubmissionProps) {
    const [repoLink, setRepoLink] = useState(existingLink || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isLocked = quizRequired && !quizPassed
    const hasSubmitted = !!existingLink

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!repoLink || isLocked || isReviewed) return

        setIsSubmitting(true)
        setError(null)
        try {
            await submitProject(lessonId, repoLink)
            // Redirect or refresh is handled by the page revalidation
        } catch (e: any) {
            console.error(e)
            setError(e.message || 'Failed to submit project')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Show reviewed status with rating and feedback (locked, no form)
    if (isReviewed && existingLink) {
        return (
            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-900/30 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-500 text-white p-1.5 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg">Project Reviewed by Instructor</h3>
                </div>

                <div className="space-y-3 ml-9">
                    <div>
                        <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Submitted Link:</span>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                            <a href={existingLink} target="_blank" rel="noopener noreferrer" className="underline break-all hover:text-blue-800 transition-colors">{existingLink}</a>
                        </p>
                    </div>

                    {rating !== null && (
                        <div>
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Rating:</span>
                            <p className="text-2xl font-black text-blue-800 dark:text-blue-200 mt-1">{rating}/100</p>
                        </div>
                    )}

                    {feedback && (
                        <div>
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Instructor Feedback:</span>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 p-3 bg-blue-100/50 dark:bg-blue-950/30 rounded-lg italic">"{feedback}"</p>
                        </div>
                    )}

                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-3 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                        This submission is locked and cannot be updated.
                    </p>
                </div>
            </div>
        )
    }

    // Show form with input + button (for both initial submission and updates)
    return (
        <div className="p-8 border-2 rounded-2xl bg-card shadow-lg">
            <h3 className="text-2xl font-black mb-2 tracking-tight">Project Submission</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
                Submit your project to complete this lesson. We accept **public GitHub repositories**, **Google Docs**, or any other **publicly accessible link**.
            </p>

            {/* Show current submission status if exists */}
            {hasSubmitted && !isReviewed && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className="text-sm font-bold text-green-800 dark:text-green-300">Currently Submitted:</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400 ml-6">
                        <a href={existingLink!} target="_blank" rel="noopener noreferrer" className="underline break-all hover:text-green-600 transition-colors">{existingLink}</a>
                    </p>
                    <p className="text-xs text-green-600/70 mt-2 ml-6 italic">You can update your submission below.</p>
                </div>
            )}

            {isLocked && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl mb-6 flex items-start gap-3">
                    <span className="text-xl">🔒</span>
                    <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                        Please pass the lesson quiz first to unlock project submission.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        Project Link
                    </label>
                    <div className="flex gap-3">
                        <Input
                            type="url"
                            placeholder="https://github.com/yourname/project or https://docs.google.com/..."
                            value={repoLink}
                            onChange={(e) => setRepoLink(e.target.value)}
                            required
                            disabled={isLocked || isSubmitting}
                            className="flex-1 h-12 rounded-xl border-primary/10 focus-visible:ring-primary shadow-inner"
                        />
                        <Button
                            type="submit"
                            disabled={isLocked || isSubmitting || !repoLink}
                            className="h-12 px-8 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Submitting...' : hasSubmitted ? 'Update' : 'Submit'}
                        </Button>
                    </div>
                </div>
                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </form>
        </div>
    )
}
