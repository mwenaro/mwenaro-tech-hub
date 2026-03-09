import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Award, Calendar, User, BookOpen, AlertCircle } from "lucide-react"
import { format } from 'date-fns'
import Link from 'next/link'

interface VerifyPageProps {
    params: {
        id: string
    }
}

export default async function VerifyCertificatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch certificate details
    // We assume the ID passed is the verification ID or certificate ID
    const { data: certificate, error } = await supabase
        .from('certificates')
        .select(`
            id,
            issued_at,
            course_id,
            user_id,
            verification_id,
            profiles (
                full_name
            ),
            courses (
                title
            )
        `)
        .or(`id.eq.${id},verification_id.eq.${id}`)
        .single()

    if (error || !certificate) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
                <Card className="max-w-md w-full border-red-500/20 bg-red-500/5 text-center p-12 rounded-3xl">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-black text-white mb-4 uppercase">Verification Failed</h1>
                    <p className="text-zinc-400 font-medium mb-8">
                        The requested credential could not be authenticated. This may be due to an invalid link or a revoked certificate.
                    </p>
                    <Link href="/" className="inline-flex items-center justify-center bg-zinc-900 text-white rounded-xl h-11 px-8 font-bold border border-zinc-800 hover:bg-zinc-800 transition-all">
                        Return Home
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-6 sm:p-12">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1a1a1a_0%,_transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-2xl">
                <div className="flex items-center justify-center gap-2 mb-12">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <Award className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">Central Accreditation Registry</span>
                </div>

                <Card className="bg-[#0A0A0A]/80 border-zinc-800 backdrop-blur-2xl rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/5">
                    <div className="p-12 text-center border-b border-zinc-800/50 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            <ShieldCheck className="w-4 h-4" />
                            Cryptographically Authenticated
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight tracking-tighter uppercase">
                            Credential Validated
                        </h1>
                        <p className="text-zinc-500 font-mono text-[10px] tracking-[0.2em] uppercase">
                            Registry Node: {certificate.verification_id || certificate.id}
                        </p>
                    </div>
                    
                    <CardContent className="p-12 space-y-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                            <div className="space-y-5 border-l-2 border-zinc-800 pl-8">
                                <div className="flex items-center gap-3 text-zinc-500">
                                    <User className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Accredited Member</span>
                                </div>
                                <p className="text-3xl font-bold text-white leading-none">
                                    {(certificate.profiles as any)?.full_name || 'Anonymous Student'}
                                </p>
                            </div>
                            
                            <div className="space-y-5 border-l-2 border-zinc-800 pl-8">
                                <div className="flex items-center gap-3 text-zinc-500">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Academic Domain</span>
                                </div>
                                <p className="text-3xl font-bold text-white leading-none">
                                    {(certificate.courses as any)?.title || 'Advanced Engineering'}
                                </p>
                            </div>
                        </div>

                        <div className="pt-16 border-t border-zinc-800/50 grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 text-zinc-500">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Conferral Date</span>
                                </div>
                                <p className="text-xl font-bold text-zinc-300">
                                    {format(new Date(certificate.issued_at), 'MMMM do, yyyy')}
                                </p>
                            </div>
                            <div className="flex flex-col justify-end text-[11px] text-zinc-500 font-medium leading-relaxed italic">
                                <p className="border-l-2 border-primary/40 pl-6">
                                    This credential serves as formal evidence of technical mastery within the Mwenaro Academy ecosystem. 
                                    It is verified against our distributed ledger to ensure absolute integrity and non-repudiation.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-12 text-center text-zinc-600 text-xs font-medium px-8 leading-relaxed">
                    Mwenaro Tech Academy uses cryptographic validation to ensure the integrity of our certifications. 
                    If you believe this record is inaccurate, contact our support team at verification@mwenaro.com.
                </div>
            </div>
        </div>
    )
}
