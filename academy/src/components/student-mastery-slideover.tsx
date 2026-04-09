'use client'

import { useState, useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
    CheckCircle2, 
    Clock, 
    XCircle, 
    Send, 
    Trophy,
    History,
    Code
} from 'lucide-react'
import { StudentMasteryItem, getStudentDetailedMastery, nudgeStudent } from '@/lib/instructor'
import { toast } from 'sonner'

interface StudentMasterySlideoverProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    student: {
        user_id: string
        full_name: string | null
        email: string
        cohort_name: string
        course_id: string
    }
}

export function StudentMasterySlideover({ 
    isOpen, 
    onOpenChange, 
    student 
}: StudentMasterySlideoverProps) {
    const [mastery, setMastery] = useState<StudentMasteryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [nudgeMessage, setNudgeMessage] = useState('')
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchMastery()
        }
    }, [isOpen, student.user_id])

    async function fetchMastery() {
        setIsLoading(true)
        try {
            const data = await getStudentDetailedMastery(student.user_id, student.course_id)
            setMastery(data)
        } catch (error) {
            toast.error('Failed to load mastery data')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleNudge() {
        if (!nudgeMessage.trim()) return
        setIsSending(true)
        try {
            await nudgeStudent(student.user_id, student.cohort_name, nudgeMessage)
            toast.success(`Message sent to ${student.full_name || 'Student'}`)
            setNudgeMessage('')
        } catch (error) {
            toast.error('Failed to send message')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl h-screen flex flex-col p-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <SheetHeader className="p-8 pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black border border-primary/20">
                            {student.full_name?.[0] || student.email[0].toUpperCase()}
                        </div>
                        <div>
                            <SheetTitle className="text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                                {student.full_name || 'Student Overview'}
                            </SheetTitle>
                            <SheetDescription className="text-zinc-500 font-medium">
                                Tracking progress for {student.cohort_name}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1 px-8 py-6">
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Mastery Roadmap</h4>
                            
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : mastery.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-zinc-500 font-bold uppercase text-xs tracking-wider">No curriculum data found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {mastery.map((item, idx) => (
                                        <div key={item.lesson_id} className="relative group">
                                            {idx !== mastery.length - 1 && (
                                                <div className="absolute left-[23px] top-12 w-[2px] h-12 bg-zinc-100 dark:bg-zinc-800 group-hover:bg-primary/20 transition-colors" />
                                            )}
                                            
                                            <div className="flex gap-4 items-start bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all">
                                                <div className={`mt-1 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                                                    item.is_completed 
                                                    ? 'bg-green-500/10 border-green-500/50 text-green-500' 
                                                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400'
                                                }`}>
                                                    {item.is_completed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-5 h-5" />}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-black tracking-tight leading-tight mb-2 ${item.is_completed ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                                                        {item.title}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.score !== null && (
                                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-none h-5 text-[9px] font-bold uppercase px-1.5 flex items-center gap-1">
                                                                <Trophy className="w-2.5 h-2.5" />
                                                                {item.score}% Score
                                                            </Badge>
                                                        )}
                                                        <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-none h-5 text-[9px] font-bold uppercase px-1.5 flex items-center gap-1">
                                                            <History className="w-2.5 h-2.5" />
                                                            {item.attempts} {item.attempts === 1 ? 'Attempt' : 'Attempts'}
                                                        </Badge>
                                                        {item.project_submitted && (
                                                            <Badge variant="secondary" className={`h-5 text-[9px] font-bold uppercase px-1.5 flex items-center gap-1 border-none ${
                                                                item.project_rating 
                                                                ? 'bg-green-500/10 text-green-500' 
                                                                : 'bg-orange-500/10 text-orange-500'
                                                            }`}>
                                                                <Code className="w-2.5 h-2.5" />
                                                                {item.project_rating ? `Project: ${item.project_rating}%` : 'Project Pending'}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Quick Nudge Footer */}
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900">
                        <div className="flex items-center gap-2 mb-4">
                            <Send className="w-4 h-4 text-primary" />
                            <h4 className="text-sm font-black text-zinc-900 dark:text-white">Nudge Learner</h4>
                        </div>
                        <div className="relative group">
                            <Textarea 
                                placeholder="Provide guidance or encourage them to resume..."
                                value={nudgeMessage}
                                onChange={(e) => setNudgeMessage(e.target.value)}
                                className="min-h-[100px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 focus-visible:ring-primary shadow-sm text-sm font-medium"
                            />
                            <Button 
                                onClick={handleNudge}
                                disabled={isSending || !nudgeMessage.trim()}
                                className="absolute bottom-4 right-4 h-10 px-4 rounded-2xl font-black shadow-lg hover:shadow-primary/20 transition-all uppercase text-[10px] tracking-widest gap-2"
                            >
                                {isSending ? 'Sending...' : 'Send Message'}
                                <Send className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
