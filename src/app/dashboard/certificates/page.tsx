import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

export default function CertificatesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>

            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No Certificates Yet</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Complete courses to earn certificates. They will appear here once issued.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
