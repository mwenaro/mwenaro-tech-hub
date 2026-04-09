"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BellRing, Loader2 } from "lucide-react"
import { nudgeStudent } from "@/lib/instructor"
import { toast } from "sonner"

interface NudgeButtonProps {
    userId: string
    cohortName: string
    studentName: string
}

export function NudgeButton({ userId, cohortName, studentName }: NudgeButtonProps) {
    const [isNudging, setIsNudging] = useState(false)

    const handleNudge = async () => {
        setIsNudging(true)
        try {
            await nudgeStudent(
                userId, 
                cohortName, 
                `Hello ${studentName}, your instructor noticed you might be falling slightly behind in the ${cohortName} roadmap. Reach out if you need any assistance!`
            )
            toast.success("Student nudged successfully!")
        } catch (error) {
            console.error("Failed to nudge student:", error)
            toast.error("Failed to send nudge. Please try again.")
        } finally {
            setIsNudging(false)
        }
    }

    return (
        <Button 
            onClick={handleNudge} 
            disabled={isNudging}
            variant="outline"
            className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-bold gap-2"
        >
            {isNudging ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <BellRing className="w-4 h-4" />
            )}
            Nudge Learner
        </Button>
    )
}
