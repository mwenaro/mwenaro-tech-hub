import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignupForm from './signup-form'

export const metadata = {
    title: "Create an Account",
    description: "Join Mwenaro Academy today. Create your free account and start learning to code with project-based, expert-led bootcamps.",
};

export default async function SignupPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const role = user.user_metadata?.role
        if (role === 'admin') redirect('/admin/dashboard')
        else if (role === 'instructor') redirect('/instructor/dashboard')
        else redirect('/dashboard')
    }

    return <SignupForm />
}
