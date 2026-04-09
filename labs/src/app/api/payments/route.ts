import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Payment, Project } from '@/lib/models';
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