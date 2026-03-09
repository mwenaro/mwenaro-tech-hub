import { Zap, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StreakLeaderboardProps {
    topStreaks: any[]
}

export function StreakLeaderboard({ topStreaks }: StreakLeaderboardProps) {
    if (topStreaks.length === 0) return null

    return (
        <Card className="border-none bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none ring-1 ring-inset ring-zinc-200/50 dark:ring-zinc-800/50 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-sm font-black uppercase tracking-wider text-foreground">Top Streaks</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {topStreaks.map((streak, idx) => {
                    const profile = Array.isArray(streak.profiles) ? streak.profiles[0] : streak.profiles
                    const name = profile?.full_name || 'Anonymous'
                    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase()

                    return (
                        <div key={idx} className="flex items-center gap-3 group">
                            <div className="relative">
                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                    <AvatarImage src={profile?.avatar_url} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
                                </Avatar>
                                {idx < 3 && (
                                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black border-2 border-background">
                                        {idx + 1}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Zap className="h-3 w-3 text-orange-500 fill-current" />
                                    <span className="text-xs font-black text-orange-500">{streak.current_streak} Day Streak</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
