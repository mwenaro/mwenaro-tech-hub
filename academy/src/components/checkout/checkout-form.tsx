'use client'

import { useState } from 'react'
import { Course } from '@/lib/courses'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, ShieldCheck, Loader2 } from "lucide-react"
import { initiateStkPush } from '@/lib/payments/mpesa'
import { createStripeCheckoutSession } from '@/lib/payments/stripe'
import { toast } from 'sonner'

interface CheckoutFormProps {
    course: Course
    userId: string
}

export function CheckoutForm({ course, userId }: CheckoutFormProps) {
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'stripe'>('mpesa')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handlePayment = async () => {
        setIsLoading(true)
        try {
            if (paymentMethod === 'mpesa') {
                if (!phoneNumber) {
                    toast.error('Please enter your M-Pesa phone number')
                    setIsLoading(false)
                    return
                }
                const result = await initiateStkPush(phoneNumber, course.price, course.title)
                if (result.success) {
                    toast.success('STK Push initiated! Please check your phone.')
                } else {
                    toast.error(result.message)
                }
            } else {
                const result = await createStripeCheckoutSession(course.id, course.title, course.price, userId)
                if (result.success && result.url) {
                    window.location.href = result.url
                } else {
                    toast.error(result.message)
                }
            }
        } catch (error) {
            console.error('Payment error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto p-4 md:p-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/50 shadow-xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Payment Method</CardTitle>
                        <CardDescription>Select how you would like to pay for {course.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup
                            defaultValue="mpesa"
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            onValueChange={(v) => setPaymentMethod(v as any)}
                        >
                            <Label
                                htmlFor="mpesa"
                                className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="mpesa" id="mpesa" className="sr-only" />
                                    <div className={`p-2 rounded-xl ${paymentMethod === 'mpesa' ? 'bg-primary text-white' : 'bg-muted'}`}>
                                        <Smartphone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold">M-Pesa</p>
                                        <p className="text-xs text-muted-foreground">Mobile Money (STK Push)</p>
                                    </div>
                                </div>
                                {paymentMethod === 'mpesa' && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </Label>

                            <Label
                                htmlFor="stripe"
                                className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="stripe" id="stripe" className="sr-only" />
                                    <div className={`p-2 rounded-xl ${paymentMethod === 'stripe' ? 'bg-primary text-white' : 'bg-muted'}`}>
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Card / Stripe</p>
                                        <p className="text-xs text-muted-foreground">Credit or Debit Card</p>
                                    </div>
                                </div>
                                {paymentMethod === 'stripe' && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </Label>
                        </RadioGroup>

                        {paymentMethod === 'mpesa' && (
                            <div className="space-y-2 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label htmlFor="phone">Phone Number (M-Pesa)</Label>
                                <Input
                                    id="phone"
                                    placeholder="0712345678"
                                    className="h-12 rounded-xl"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">You will receive an STK Push on your phone to authorize the payment.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center gap-2 p-4 bg-green-500/10 text-green-700 dark:text-green-400 rounded-2xl border border-green-500/20">
                    <ShieldCheck className="h-5 w-5" />
                    <p className="text-sm font-medium">Secure Checkout. Your payment information is encrypted and safe.</p>
                </div>
            </div>

            <div className="lg:col-span-1">
                <Card className="sticky top-8 border-border/50 shadow-2xl shadow-primary/10">
                    <CardHeader>
                        <CardTitle className="text-xl">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <div className="h-20 w-20 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                                {course.image_url ? (
                                    <img src={course.image_url} alt={course.title} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                                        <CreditCard className="h-8 w-8" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm line-clamp-2">{course.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{course.level || 'All Levels'}</p>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Original Price</span>
                                <span className="line-through text-muted-foreground">
                                    {paymentMethod === 'mpesa' ? `KES ${course.original_price || course.price + 500}` : `$${(course.original_price || course.price + 5)?.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-black">
                                <span>Total</span>
                                <span className="text-primary">
                                    {paymentMethod === 'mpesa' ? `KES ${course.price}` : `$${course.price.toFixed(2)}`}
                                </span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/20"
                            onClick={handlePayment}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : `Pay with ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'Stripe'}`}
                        </Button>

                        <p className="text-[10px] text-center text-muted-foreground">
                            By placing your order, you agree to Mwenaro's Terms of Service and Privacy Policy.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
