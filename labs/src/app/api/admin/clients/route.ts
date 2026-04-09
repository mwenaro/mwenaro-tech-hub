import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, Project } from '@/lib/models';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const clients = await User.find({ role: 'client' }).sort({ createdAt: -1 });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}