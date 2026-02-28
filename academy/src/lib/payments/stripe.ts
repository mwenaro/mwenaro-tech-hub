'use server'

import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe() {
    if (!stripeInstance) {
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2025-01-27-ac.0' as any,
        });
    }
    return stripeInstance;
}

export async function createStripeCheckoutSession(courseId: string, courseTitle: string, amount: number, userId: string) {
    try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: courseTitle,
                        },
                        unit_amount: amount * 100, // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_ACADEMY_URL}/dashboard?payment=success&courseId=${courseId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_ACADEMY_URL}/checkout/${courseId}?payment=cancelled`,
            metadata: {
                courseId,
                userId,
            },
        });

        return { success: true, url: session.url };
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        return { success: false, message: 'Failed to initiate Stripe payment' };
    }
}
