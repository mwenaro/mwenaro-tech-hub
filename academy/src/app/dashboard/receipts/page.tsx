import { getMyReceipts } from '@/lib/receipts'
import { ReceiptButton } from '@/components/payments/receipt-button'
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { CreditCard, History, Clock, CheckCircle2 } from "lucide-react"
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default async function ReceiptsPage() {
    const receipts = await getMyReceipts()

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Billing & Receipts</h1>
                <p className="text-muted-foreground">
                    Manage your learning investments and download official payment records.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="pb-2">
                        <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary mb-2">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Invested</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black">
                            KES {receipts.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="bg-green-500/5 border-green-500/10">
                    <CardHeader className="pb-2">
                        <div className="p-2 w-fit rounded-lg bg-green-500/10 text-green-500 mb-2">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black">100%</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-500/5 border-zinc-500/10">
                    <CardHeader className="pb-2">
                        <div className="p-2 w-fit rounded-lg bg-zinc-500/10 text-zinc-500 mb-2">
                            <History className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black">{receipts.length}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
                    <TableRow className="border-zinc-200 dark:border-zinc-800 h-14">
                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 pl-8">Course</TableHead>
                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Date</TableHead>
                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Amount</TableHead>
                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Status</TableHead>
                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 text-right pr-8">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {receipts.length > 0 ? (
                        receipts.map((receipt) => (
                            <TableRow key={receipt.id} className="border-zinc-100 dark:border-zinc-800/50 h-16 group">
                                <TableCell className="pl-8">
                                    <p className="font-bold text-zinc-900 dark:text-white">{receipt.course_title}</p>
                                    <p className="text-[10px] text-zinc-400 font-mono uppercase truncate max-w-[150px]">Ref: {receipt.provider_reference || 'N/A'}</p>
                                </TableCell>
                                <TableCell className="text-sm text-zinc-500 font-medium">
                                    {format(new Date(receipt.created_at), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell className="font-black text-zinc-900 dark:text-white">
                                    {receipt.currency} {receipt.amount.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {receipt.status === 'completed' ? (
                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-bold text-[10px] uppercase gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Paid
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 font-bold text-[10px] uppercase gap-1">
                                            <Clock className="w-3 h-3" />
                                            {receipt.status}
                                        </Badge>
                                    )
                                    }
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <ReceiptButton receipt={receipt} />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-64 text-center">
                                <div className="flex flex-col items-center justify-center text-zinc-400">
                                    <CreditCard className="w-8 h-8 opacity-20 mb-4" />
                                    <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">No transactions recorded</p>
                                    <p className="text-sm font-medium">Your payment history will appear here once you enroll in a course.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Card>
        </div>
    )
}
