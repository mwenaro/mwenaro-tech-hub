import { getInstructorSessions, getMyCohorts } from '@/lib/sessions'
import { Card } from '@/components/ui/card'
import { CreateSessionForm } from '@/components/create-session-form'
import { Calendar, Video, Clock, Info, Users, PlusCircle } from 'lucide-react'
import { format } from 'date-fns'

export const revalidate = 0

export default async function SessionsPage() {
    const sessions = await getInstructorSessions()
    const cohorts = await getMyCohorts()

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Live Sessions</h1>
                        </div>
                        <p className="text-zinc-500 font-medium ml-1">Schedule and manage interaction with your various cohorts.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Create Session Section */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-3xl sticky top-24 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <PlusCircle className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold tracking-tight">New Broadcast</h2>
                            </div>
                            <CreateSessionForm cohorts={cohorts} />
                        </Card>
                    </div>

                    {/* Sessions List Section */}
                    <div className="lg:col-span-3 space-y-6">
                        {sessions.length === 0 ? (
                            <Card className="p-16 border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-transparent flex flex-col items-center justify-center text-center rounded-3xl">
                                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-4">
                                    <Video className="w-10 h-10 text-zinc-400" />
                                </div>
                                <p className="font-bold text-xl text-zinc-900 dark:text-zinc-100">No active sessions</p>
                                <p className="text-zinc-500 max-w-sm mt-2">
                                    You haven't scheduled any live sessions yet. Use the form to broadcast to your students.
                                </p>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sessions.map((session) => (
                                    <Card key={session.id} className="p-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-3xl hover:shadow-xl transition-all group">
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                                    <Users className="w-3.5 h-3.5 text-zinc-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                        {session.cohort?.name}
                                                    </span>
                                                </div>
                                                <div className="p-2 bg-primary/5 rounded-xl group-hover:bg-primary/20 transition-colors">
                                                    <Video className="w-5 h-5 text-primary" />
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black mb-3 tracking-tight group-hover:text-primary transition-colors">
                                                {session.title}
                                            </h3>
                                            
                                            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-8 flex-1 line-clamp-3 leading-relaxed">
                                                {session.description || 'No additional details provided for this session.'}
                                            </p>

                                            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-auto">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                                            <Calendar className="w-4 h-4 text-primary" />
                                                            <span className="text-sm font-bold">
                                                                {format(new Date(session.start_time), 'MMM d, yyyy')}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-zinc-500">
                                                            <Clock className="w-4 h-4" />
                                                            <span className="text-xs font-medium">
                                                                {format(new Date(session.start_time), 'h:mm a')} • {session.duration_minutes}m
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {session.meeting_link && (
                                                        <a
                                                            href={session.meeting_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="h-12 px-6 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-black rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-zinc-200 dark:shadow-none"
                                                        >
                                                            Launch
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
