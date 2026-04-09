'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Loader2 } from "lucide-react"
import { resetLessonQuiz } from "@/lib/progress"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ResetQuizButtonProps {
    lessonId: string
    userId: string
    lessonTitle: string
}

export function ResetQuizButton({ lessonId, userId, lessonTitle }: ResetQuizButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleReset = async () => {
        setIsLoading(true)
        try {
            const result = await resetLessonQuiz(lessonId, userId)
            if (result.success) {
                toast.success(`Quiz reset for "${lessonTitle}"`)
            } else {
                toast.error(result.message || "Failed to reset quiz")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <RotateCcw className="h-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background/95 backdrop-blur-md border-white/10">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black">Reset Quiz Progress?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        This will clear all quiz attempts and scores for <span className="font-bold text-foreground">"{lessonTitle}"</span>. 
                        The student will be able to start over with 3 new trials. Project submissions will remain intact.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="font-bold border-white/5 bg-white/5 hover:bg-white/10">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleReset}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Reset Quiz
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
