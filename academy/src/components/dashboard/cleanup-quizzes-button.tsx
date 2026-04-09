'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { cleanupDuplicateQuizzes } from "@/lib/progress"
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

export function CleanupQuizzesButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleCleanup = async () => {
        setIsLoading(true)
        try {
            const result = await cleanupDuplicateQuizzes()
            if (result.success) {
                toast.success(`System Cleanup complete! ${result.count} records reset.`)
            } else {
                toast.error("Cleanup failed")
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
                    className="h-12 px-6 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 font-black flex items-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    System Cleanup
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background/95 backdrop-blur-md border-white/10">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black uppercase tracking-tight">Perform Bulk Quiz Cleanup?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        This will identify all students with <span className="text-foreground font-bold">multiple quiz attempts</span> and reset their progress for those lessons. 
                        This ensures only the new highest-of-3 system is active. <span className="font-bold text-red-500">This action cannot be undone.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleCleanup}
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Start Cleanup
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
