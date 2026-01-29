'use client'

import { useState } from 'react'
import { createCourse } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export function CreateCourseForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60'
        }

        try {
            await createCourse(data)
            const form = e.target as HTMLFormElement
            form.reset()
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to create course')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-1 block">Course Title</label>
                <Input name="title" placeholder="e.g. Master React.js" required />
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea name="description" placeholder="What will they learn?" required rows={4} />
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Price ($)</label>
                <Input type="number" name="price" defaultValue={49.99} step="0.01" required />
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Image URL (Optional)</label>
                <Input name="image_url" placeholder="https://..." />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Course'}
            </Button>
        </form>
    )
}
