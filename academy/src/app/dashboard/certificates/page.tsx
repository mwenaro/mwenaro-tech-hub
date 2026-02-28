import { getCertificates } from '@/lib/certificates'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Award } from "lucide-react"
import { CertificateDownload } from '@/components/certificates/certificate-download'
import { format } from 'date-fns'

export default async function CertificatesPage() {
    const certificates = await getCertificates()

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Your Certificates</h1>
                <p className="text-muted-foreground">
                    Verifiable records of your learning achievements.
                </p>
            </div>

            {certificates.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">No certificates yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Complete a course with 100% progress to earn your certificate.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-all group">
                            <div className="h-2 bg-primary w-full" />
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                        Official
                                    </span>
                                </div>
                                <CardTitle className="text-lg font-bold mt-4 line-clamp-2">
                                    {cert.course_title}
                                </CardTitle>
                                <CardDescription>
                                    Issued on {format(new Date(cert.issued_at), 'MMM d, yyyy')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 flex justify-end">
                                <CertificateDownload certificate={cert} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
