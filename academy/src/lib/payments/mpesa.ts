'use server'

/**
 * M-Pesa Daraja API Integration (STK Push)
 */

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const PASSKEY = process.env.MPESA_PASSKEY || '';
const SHORTCODE = process.env.MPESA_SHORTCODE || '174379'; // Default Sandbox Shortcode
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || '';

export async function getDarajaAccessToken() {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    try {
        const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting Daraja access token:', error);
        return null;
    }
}

export async function initiateStkPush(phoneNumber: string, amount: number, accountReference: string) {
    const accessToken = await getDarajaAccessToken();
    if (!accessToken) return { success: false, message: 'Failed to authenticate with Safaricom' };

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    // Format phone number to 254XXXXXXXXX
    let formattedPhone = phoneNumber.replace(/\+/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
    }

    const payload = {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: `Payment for ${accountReference}`
    };

    try {
        const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.ResponseCode === '0') {
            return {
                success: true,
                merchantRequestID: data.MerchantRequestID,
                checkoutRequestID: data.CheckoutRequestID,
                message: data.CustomerMessage
            };
        } else {
            return { success: false, message: data.errorMessage || 'STK Push failed' };
        }
    } catch (error) {
        console.error('Error initiating STK push:', error);
        return { success: false, message: 'Internal server error' };
    }
}
