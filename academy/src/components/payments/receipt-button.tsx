'use client'

import { useState } from 'react'
import { Receipt } from '@/lib/receipts'
import { ReceiptVoucher } from './receipt-vouchers'
import { 
    Dialog, 
    DialogContent, 
    DialogTrigger 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

interface ReceiptButtonProps {
    receipt: Receipt
}

export function ReceiptButton({ receipt }: ReceiptButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 text-zinc-500 hover:text-primary hover:bg-primary/5 font-bold transition-all"
                >
                    <FileText className="w-4 h-4" />
                    View Receipt
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 p-0 overflow-hidden rounded-3xl">
                <ReceiptVoucher receipt={receipt} />
            </DialogContent>
        </Dialog>
    )
}
