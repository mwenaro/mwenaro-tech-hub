import { ResetQuizButton } from "./reset-quiz-button"
import { StudentMasteryItem } from "@/lib/instructor"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, CheckCircle2, Circle, Trophy } from "lucide-react"

interface MasteryRoadmapProps {
    mastery: StudentMasteryItem[]
    userId?: string
    showReset?: boolean
}

export function MasteryRoadmap({ mastery, userId, showReset }: MasteryRoadmapProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="p-2 rounded-xl bg-primary/10">
                    <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Mastery <span className="text-primary italic">Roadmap</span></h2>
            </div>

            <div className="grid gap-4">
                {mastery.map((item, index) => (
                    <Card key={item.lesson_id} className={`p-6 bg-card/40 backdrop-blur-sm border-white/10 hover:border-primary/30 transition-all duration-300 relative overflow-hidden group ${!item.is_completed && 'opacity-70'}`}>
                        {item.is_completed && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                        )}
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-500 ${item.is_completed ? 'bg-primary/10 border-primary/20 text-primary scale-110' : 'bg-muted/10 border-white/5 text-muted-foreground'}`}>
                                {item.is_completed ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                ) : (
                                    <Circle className="w-6 h-6" />
                                )}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-1 font-bold">
                                    <span className="text-xs text-primary/70 uppercase tracking-widest">Lesson {index + 1}</span>
                                    {item.is_completed ? (
                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">Mastered</Badge>
                                    ) : (
                                        <Badge className="bg-muted text-muted-foreground border-white/5 text-[10px]">Pending</Badge>
                                    )}
                                </div>
                                <h3 className="text-xl font-black group-hover:text-primary transition-colors italic">{item.title}</h3>
                            </div>

                            <div className="flex items-center gap-8 pr-4">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">Quiz Score</p>
                                    <p className={`text-xl font-black ${item.score && item.score >= 80 ? 'text-green-500' : item.score && item.score >= 50 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                        {item.score !== null ? `${item.score}%` : '—'}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">Attempts</p>
                                    <p className="text-xl font-black">{item.attempts || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">Project</p>
                                    {item.project_submitted ? (
                                        <div className="flex items-center gap-1 text-primary">
                                            <Trophy className="w-5 h-5" />
                                            <span className="text-xl font-black">{item.project_rating || '—'}</span>
                                        </div>
                                    ) : (
                                        <CheckCircle2 className="w-5 h-5 text-muted/30" />
                                    )}
                                </div>
                                
                                {showReset && userId && (
                                    <div className="pl-4 border-l border-white/5">
                                        <ResetQuizButton 
                                            lessonId={item.lesson_id} 
                                            userId={userId} 
                                            lessonTitle={item.title} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
