import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project, Notification } from '@/lib/models';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const proposals = await Project.find({
      status: { $in: ['submitted', 'under_review', 'accepted', 'rejected'] },
    })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error('Get proposals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}