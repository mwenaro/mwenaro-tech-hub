"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, Star, Zap } from "lucide-react";
import { getStreakConfig } from "@/lib/streaks";

interface StreakCelebrationProps {
    streak: number;
    open: boolean;
    onClose: () => void;
}

export function StreakCelebration({
    streak,
    open,
    onClose,
}: StreakCelebrationProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const config = getStreakConfig(streak);

    // Map icon type to component
    const IconComponent =
        config.iconType === "trophy"
            ? Trophy
            : config.iconType === "star"
                ? Star
                : Flame;

    useEffect(() => {
        if (open) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md overflow-hidden">
                {/* Background gradient */}
                <div
                    className={`absolute inset-0 bg-gradient-to-b ${config.bgGradient} pointer-events-none`}
                />

                {/* Confetti particles */}
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 rounded-full animate-fade-in"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    backgroundColor: [
                                        "#fbbf24",
                                        "#a855f7",
                                        "#ef4444",
                                        "#22c55e",
                                        "#3b82f6",
                                    ][i % 5],
                                    animation: `fall ${1.5 + Math.random()}s ease-out forwards`,
                                    animationDelay: `${Math.random() * 0.5}s`,
                                }}
                            />
                        ))}
                    </div>
                )}

                <DialogHeader className="relative z-10 text-center space-y-4">
                    {/* Animated icon */}
                    <div className="mx-auto relative">
                        <div
                            className={`w-24 h-24 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center animate-scale-in`}
                        >
                            <IconComponent className="w-12 h-12 text-white" />
                        </div>
                        {/* Pulse ring */}
                        <div
                            className={`absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br ${config.gradient} opacity-30 animate-ping`}
                        />
                    </div>

                    <div className="space-y-2 animate-fade-in">
                        <DialogTitle className="text-3xl font-display font-bold">
                            {config.title}
                        </DialogTitle>
                        <div
                            className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                        >
                            {config.subtitle}
                        </div>
                    </div>

                    <DialogDescription className="text-base text-muted-foreground animate-fade-in">
                        {config.message}
                    </DialogDescription>

                    {/* Streak count badge */}
                    <div className="flex items-center justify-center gap-2 py-4 animate-fade-in">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
                            <Zap className="w-5 h-5 text-primary" />
                            <span className="font-bold text-lg">{streak} days</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="relative z-10 flex justify-center pt-2">
                    <Button onClick={onClose} size="lg" className="bg-primary hover:bg-primary/90">
                        Keep Learning!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Add custom animations to globals.css if not already present
// @keyframes fall {
//   to {
//     transform: translateY(100vh) rotate(360deg);
//     opacity: 0;
//   }
// }
