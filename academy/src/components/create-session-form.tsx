'use client'

import { useState } from 'react'
import { createSession } from '@/lib/sessions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { 
    Calendar, 
    Clock, 
    Link as LinkIcon, 
    Type, 
    AlignLeft, 
    Users,
    Sparkles
} from 'lucide-react'

interface CreateSessionFormProps {
    cohorts: { id: string; name: string }[]
}

export function CreateSessionForm({ cohorts }: CreateSessionFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const data = {
            cohort_id: formData.get('cohort_id') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            start_time: formData.get('start_time') as string,
            duration_minutes: parseInt(formData.get('duration_minutes') as string),
            meeting_link: formData.get('meeting_link') as string
        }

        try {
            await createSession(data)
            const form = e.target as HTMLFormElement
            form.reset()
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to create session')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (cohorts.length === 0) {
        return (
            <div className="text-sm font-bold text-red-500 bg-red-500/5 p-4 rounded-2xl border border-red-500/10 flex items-center gap-3">
                <Info className="w-5 h-5" />
                No active cohorts lead by you.
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        Target Cohort
                    </label>
                    <select
                        name="cohort_id"
                        required
                        className="w-full h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                    >
                        {cohorts.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                        <Type className="w-3 h-3" />
                        Session Title
                    </label>
                    <Input 
                        name="title" 
                        required 
                        placeholder="e.g. Masterclass: Advanced State Management" 
                        className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 font-bold placeholder:font-medium"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            Date & Time
                        </label>
                        <Input 
                            type="datetime-local" 
                            name="start_time" 
                            required 
                            className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            Min.
                        </label>
                        <Input 
                            type="number" 
                            name="duration_minutes" 
                            defaultValue={60} 
                            min={15} 
                            required 
                            className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                        <LinkIcon className="w-3 h-3" />
                        Meeting Link
                    </label>
                    <Input 
                        type="url" 
                        name="meeting_link" 
                        placeholder="https://meet.google.com/..." 
                        className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 font-bold placeholder:font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                        <AlignLeft className="w-3 h-3" />
                        Agenda / Description
                    </label>
                    <Textarea 
                        name="description" 
                        placeholder="What will we cover? (Optional)" 
                        className="min-h-[100px] rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 font-medium resize-none"
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold animate-shake">
                    {error}
                </div>
            )}

            <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-200 dark:shadow-none relative overflow-hidden group"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>Broadcasting...</>
                    ) : (
                        <>
                            Schedule Session
                            <Sparkles className="w-4 h-4" />
                        </>
                    )}
                </span>
                {isSubmitting && (
                    <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                )}
            </Button>
        </form>
    )
}

function Info(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    )
}
