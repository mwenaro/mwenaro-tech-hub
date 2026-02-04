import { createClient } from "./supabase/client";

/**
 * Learning Streak Data Structure
 */
export interface LearningStreak {
    id: string;
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Streak Update Result
 */
export interface StreakUpdateResult {
    current_streak: number;
    longest_streak: number;
    is_milestone: boolean;
    milestone_value: number;
}

/**
 * Milestone values for streak celebrations
 */
export const STREAK_MILESTONES = [7, 30, 100] as const;

/**
 * Check if a streak value is a milestone
 */
export function isMilestone(streak: number): boolean {
    return STREAK_MILESTONES.includes(streak as typeof STREAK_MILESTONES[number]);
}

/**
 * Get the user's current learning streak
 */
export async function getLearningStreak(
    userId: string
): Promise<LearningStreak | null> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("learning_streaks")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {
            console.error("Error fetching learning streak:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error in getLearningStreak:", error);
        return null;
    }
}

/**
 * Update the user's learning streak
 * This should be called when a user completes a lesson
 */
export async function updateLearningStreak(
    userId: string
): Promise<StreakUpdateResult | null> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("update_learning_streak", {
            p_user_id: userId,
        });

        if (error) {
            console.error("Error updating learning streak:", error);
            return null;
        }

        // The function returns an array with one result
        if (data && data.length > 0) {
            return data[0] as StreakUpdateResult;
        }

        return null;
    } catch (error) {
        console.error("Error in updateLearningStreak:", error);
        return null;
    }
}

/**
 * Get streak configuration for UI display
 */
export function getStreakConfig(streak: number) {
    if (streak >= 100) {
        return {
            title: "🏆 LEGENDARY!",
            subtitle: "100 Day Streak!",
            message:
                "You've achieved legendary status! Your dedication is truly inspiring. Keep the momentum going!",
            gradient: "from-yellow-500 via-amber-500 to-orange-500",
            bgGradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
            iconType: "trophy" as const,
        };
    }
    if (streak >= 30) {
        return {
            title: "⭐ AMAZING!",
            subtitle: "30 Day Streak!",
            message:
                "A whole month of consistent learning! You're building incredible habits. Phenomenal work!",
            gradient: "from-purple-500 via-violet-500 to-indigo-500",
            bgGradient: "from-purple-500/20 via-violet-500/10 to-transparent",
            iconType: "star" as const,
        };
    }
    if (streak >= 7) {
        return {
            title: "🔥 ON FIRE!",
            subtitle: "7 Day Streak!",
            message:
                "One week of daily learning! You're building a powerful habit. Keep it up!",
            gradient: "from-orange-500 via-red-500 to-rose-500",
            bgGradient: "from-orange-500/20 via-red-500/10 to-transparent",
            iconType: "flame" as const,
        };
    }

    // Default for streaks less than 7
    return {
        title: "Keep Going!",
        subtitle: `${streak} Day Streak`,
        message: "You're on your way to building a great learning habit!",
        gradient: "from-blue-500 via-cyan-500 to-teal-500",
        bgGradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
        iconType: "flame" as const,
    };
}

/**
 * Check if streak is still active (last activity was today or yesterday)
 */
export function isStreakActive(lastActivityDate: string | null): boolean {
    if (!lastActivityDate) return false;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    return lastActivityDate === today || lastActivityDate === yesterday;
}
