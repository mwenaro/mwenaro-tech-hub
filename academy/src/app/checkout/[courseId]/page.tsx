import { getCourse } from '@/lib/courses'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { hasEnrolled } from '@/lib/enrollment'

interface CheckoutPageProps {
    params: Promise<{
        courseId: string
    }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { courseId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/login?redirect=/checkout/${courseId}`)
    }

    const course = await getCourse(courseId)
    if (!course) notFound()

    // Check if already enrolled
    const enrolled = await hasEnrolled(courseId)
    if (enrolled) {
        redirect(`/learn/${courseId}`)
    }


    // If free course, just enroll and redirect
    if (course.price === 0) {
        // We'll handle this in the UI or just here
        // redirect(`/api/enroll?courseId=${course.id}`) 
        // For now, let's let them see the checkout even if price is 0 (or we could just auto enroll)
    }

    return (
        <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 flex flex-col pt-20">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-black tracking-tight mb-4">Complete Your Enrollment</h1>
                    <p className="text-muted-foreground text-lg">You're one step away from starting your journey in <span className="text-foreground font-bold">{course.title}</span></p>
                </div>

                <CheckoutForm course={course} userId={user.id} />
            </div>
        </div>
    )
}
