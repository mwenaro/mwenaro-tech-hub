import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface LearnerProfileHeaderProps {
    name: string
    email: string
    progressPercent: number
    avgScore: number
    completedLessons: number
    totalLessons: number
    badgeText?: string
}

export function LearnerProfileHeader({
    name,
    email,
    progressPercent,
    avgScore,
    completedLessons,
    totalLessons,
    badgeText = "Student Profile"
}: LearnerProfileHeaderProps) {
    return (
        <div className="mb-12 p-8 rounded-[2rem] bg-white/50 dark:bg-card/50 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-2xl">
                    <AvatarFallback className="text-4xl font-black">
                        {name?.charAt(0).toUpperCase() || email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black tracking-tight">{name || "Anonymous Learner"}</h1>
                        <Badge className="w-fit mx-auto md:mx-0 bg-primary/20 text-primary border-primary/10 px-3 py-1">
                            {badgeText}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-lg mb-6">{email}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <p className="text-[10px] uppercase tracking-widest font-black text-primary/70 mb-1">Course Mastery</p>
                            <p className="text-2xl font-black">{progressPercent}%</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                            <p className="text-[10px] uppercase tracking-widest font-black text-green-500/70 mb-1">Avg Score</p>
                            <p className="text-2xl font-black">{avgScore}%</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                            <p className="text-[10px] uppercase tracking-widest font-black text-blue-500/70 mb-1">Lessons</p>
                            <p className="text-2xl font-black">{completedLessons}/{totalLessons}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                            <p className="text-[10px] uppercase tracking-widest font-black text-amber-500/70 mb-1">Activity</p>
                            <p className="text-2xl font-black">Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
