import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Payment } from '@/lib/models';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: Record<string, unknown> = { clientId: auth.userId };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, method, reference } = body;

    if (!paymentId || !method) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validMethods = ['cash', 'mobile_money', 'bank_transfer'];
    if (!validMethods.includes(method)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.clientId.toString() !== auth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (method === 'cash') {
      payment.cashReference = reference || `CASH-${Date.now()}`;
    } else if (method === 'mobile_money') {
      payment.mobileMoneyReference = reference || `MM-${Date.now()}`;
    } else if (method === 'bank_transfer') {
      payment.bankReference = reference || `BANK-${Date.now()}`;
    }

    payment.method = method;
    payment.status = 'pending';
    await payment.save();

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Submit payment proof error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
