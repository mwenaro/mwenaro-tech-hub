import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function ErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-8">
                There was an error during authentication. Please try again.
            </p>
            <div className="flex gap-4">
                <Link href="/login">
                    <Button>Back to Login</Button>
                </Link>
                <Link href="/">
                    <Button variant="outline">Go Home</Button>
                </Link>
            </div>
        </div>
    )
}
