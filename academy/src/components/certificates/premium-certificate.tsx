'use client'

import { Certificate } from '@/lib/certificates'
import { format } from 'date-fns'
import { Download, Award, ShieldCheck, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PremiumCertificateProps {
    certificate: Certificate
}

export function PremiumCertificate({ certificate }: PremiumCertificateProps) {
    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="space-y-6">
            <div className="relative aspect-[1.414/1] w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden print:shadow-none print:m-0 print:w-full">
                {/* Certificate Background Content */}
                <div className="absolute inset-0 border-[20px] border-zinc-900 m-8 flex flex-col items-center justify-between py-16 px-12 text-center">
                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary m-[-2px]" />
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-primary m-[-2px]" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-primary m-[-2px]" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary m-[-2px]" />

                    {/* Logo/Header */}
                    <div className="space-y-2">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                            <Award className="w-10 h-10" />
                        </div>
                        <h2 className="text-zinc-500 uppercase tracking-[0.5em] text-xs font-black">Mwenaro Tech Academy</h2>
                        <h1 className="text-4xl font-display font-bold text-zinc-900 mt-2">CERTIFICATE OF ACHIEVEMENT</h1>
                    </div>

                    {/* Recipient */}
                    <div className="w-full">
                        <p className="text-zinc-500 italic font-serif text-lg mb-4">This is to certify that</p>
                        <h3 className="text-5xl font-display font-bold text-primary mb-2 border-b-2 border-zinc-100 pb-4 inline-block min-w-[60%]">
                            {certificate.full_name}
                        </h3>
                        <p className="text-zinc-500 italic font-serif text-lg mt-4">has successfully completed the course</p>
                        <h4 className="text-2xl font-bold text-zinc-800 mt-2 uppercase tracking-wide">
                            {certificate.course_title}
                        </h4>
                    </div>

                    {/* Footer / Meta */}
                    <div className="w-full grid grid-cols-3 gap-8 items-end">
                        <div className="text-left">
                            <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Credential ID</p>
                            <p className="text-xs font-mono font-bold text-zinc-600">{certificate.verification_id || certificate.id.slice(0, 16).toUpperCase()}</p>
                        </div>
                        <div className="flex flex-col items-center">
                             <div className="w-32 h-1 border-b border-zinc-900 mb-2" />
                             <p className="text-[10px] font-black uppercase tracking-wider text-zinc-800">Mwero Abdalla</p>
                             <p className="text-[9px] text-zinc-500 uppercase font-bold">Founder, Mwenaro Academy</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Issue Date</p>
                            <p className="text-xs font-bold text-zinc-600">{format(new Date(certificate.issued_at), 'MMMM do, yyyy')}</p>
                        </div>
                    </div>
                </div>

                {/* Aesthetic Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                    <svg width="100%" height="100%">
                        <pattern id="cert-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="#000" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#cert-grid)" />
                    </svg>
                </div>
            </div>

            {/* Actions (Hidden in print) */}
            <div className="flex justify-center gap-4 print:hidden">
                <Button onClick={handlePrint} className="rounded-xl h-11 font-bold gap-2 px-8">
                    <Printer className="w-4 h-4" />
                    Print Certificate
                </Button>
                <Button variant="outline" className="rounded-xl h-11 font-bold gap-2 px-8">
                    <ShieldCheck className="w-4 h-4" />
                    Verify Authenticity
                </Button>
            </div>
        </div>
    )
}
