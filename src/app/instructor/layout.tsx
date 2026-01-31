import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { InstructorSidebar } from "@/components/dashboard/instructor-sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    if (user.user_metadata?.role !== 'instructor') {
        redirect("/dashboard")
    }

    return (
        <SidebarProvider>
            <InstructorSidebar user={user} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="font-semibold text-lg text-foreground">Instructor Portal</div>
                </header>
                <main className="flex-1 overflow-auto bg-muted/10">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
