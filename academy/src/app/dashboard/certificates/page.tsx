import { getCertificates } from '@/lib/certificates'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Award, ShieldCheck, Download, ExternalLink } from "lucide-react"
import { format } from 'date-fns'
import { PremiumCertificate } from '@/components/certificates/premium-certificate'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

export default async function CertificatesPage() {
    const certificates = await getCertificates()

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                        <Award className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Achievement</h1>
                </div>
                <p className="text-muted-foreground ml-12">
                    Official certifications from Mwenaro Tech Academy confirming your professional competency.
                </p>
            </div>

            {certificates.length === 0 ? (
                <Card className="border-dashed bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardContent className="py-20 text-center">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No credentials issued yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
                            Earn your first professional certificate by completing 100% of your course curriculum.
                        </p>
                        <Button className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
                            Continue Learning
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="group relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl pb-4">
                            {/* Accent Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            
                            <CardHeader className="pb-4 pt-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-primary border border-zinc-200 dark:border-zinc-800 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] font-black uppercase tracking-widest mt-1">
                                        Verified
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-black mt-2 leading-tight min-h-[3.5rem] line-clamp-2">
                                    {cert.course_title}
                                </CardTitle>
                                <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mt-2">
                                    <ShieldCheck className="w-3 h-3 text-green-500" />
                                    Issued {format(new Date(cert.issued_at), 'MMMM yyyy')}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pt-2 flex items-center gap-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="flex-1 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white rounded-xl h-11 font-bold gap-2 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                            <ExternalLink className="w-4 h-4" />
                                            View Official
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-5xl bg-zinc-50 border-zinc-200 p-8 rounded-3xl overflow-y-auto max-h-[90vh]">
                                        <PremiumCertificate certificate={cert} />
                                    </DialogContent>
                                </Dialog>
                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-primary transition-colors">
                                    <Download className="w-5 h-5" />
                                </Button>
                            </CardContent>

                            {/* Verification ID Footer */}
                            <div className="px-6 py-4 mt-2 border-t border-zinc-50 dark:border-zinc-900/50 bg-zinc-50/50 dark:bg-zinc-900/30">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Authenticity ID</p>
                                <p className="text-[10px] font-mono text-zinc-500 truncate">{cert.verification_id || cert.id.slice(0, 16).toUpperCase()}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border ${className}`}>
            {children}
        </span>
    )
}
