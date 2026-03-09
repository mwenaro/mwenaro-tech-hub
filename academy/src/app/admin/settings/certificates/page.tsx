'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, CheckCircle2, Eye } from "lucide-react"
import { PremiumCertificate } from '@/components/certificates/premium-certificate'
import { 
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

const mockCert = {
    id: 'DEMO-123456',
    full_name: 'Mwero Abdalla',
    course_title: 'Fullstack Engineering Masterclass',
    issued_at: new Date().toISOString(),
    verification_id: 'V-MW-99-ALPHA'
}

type TemplateId = 'classic' | 'modern' | 'prestige'

export default function CertificateSettingsPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic')
    const [isSaving, setIsSaving] = useState(false)

    const templates = [
        {
            id: 'classic',
            name: 'Professional Classic',
            description: 'Traditional academic style with elegant borders and serif accents.',
            preview: '/previews/classic.png'
        },
        {
            id: 'modern',
            name: 'Modern Minimal',
            description: 'Contemporary high-contrast design with clean typography.',
            preview: '/previews/modern.png'
        },
        {
            id: 'prestige',
            name: 'Prestige Dark',
            description: 'High-end dark mode theme with golden gradients for elite programs.',
            preview: '/previews/prestige.png'
        }
    ]

    const handleSave = async () => {
        setIsSaving(true)
        // In a real app, this would update a database setting
        await new Promise(r => setTimeout(r, 1000))
        setIsSaving(false)
        toast.success(`Default template updated to ${selectedTemplate.toUpperCase()}`)
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Certificate Customization</h1>
                <p className="text-muted-foreground">
                    Select and preview the default certification style for your graduates.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card 
                        key={template.id} 
                        className={`relative cursor-pointer transition-all duration-300 rounded-[2rem] overflow-hidden border-2 shadow-sm hover:shadow-xl ${
                            selectedTemplate === template.id 
                            ? 'border-primary ring-4 ring-primary/10' 
                            : 'border-zinc-200 dark:border-zinc-800'
                        }`}
                        onClick={() => setSelectedTemplate(template.id as TemplateId)}
                    >
                        <div className={`p-6 ${selectedTemplate === template.id ? 'bg-primary/5' : ''}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${
                                    selectedTemplate === template.id ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
                                }`}>
                                    <Award className="w-8 h-8" />
                                </div>
                                {selectedTemplate === template.id && (
                                    <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20" />
                                )}
                            </div>
                            <h3 className="text-xl font-black mb-2 uppercase">{template.name}</h3>
                            <p className="text-sm text-muted-foreground font-medium mb-8">
                                {template.description}
                            </p>

                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="flex-1 rounded-xl h-11 font-bold gap-2">
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-5xl bg-zinc-50 border-zinc-200 p-8 rounded-3xl overflow-y-auto max-h-[90vh]">
                                        <PremiumCertificate certificate={mockCert as any} templateId={template.id as TemplateId} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end pt-4">
                <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 px-12 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
                >
                    {isSaving ? 'Synchronizing...' : 'Apply Default Style'}
                </Button>
            </div>
        </div>
    )
}
