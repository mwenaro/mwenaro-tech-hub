import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project, Template } from '@/lib/models';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('clientId', 'name email company')
      .populate('assignedTeam.lead', 'name email roleType')
      .populate('assignedTeam.members', 'name email roleType')
      .sort({ createdAt: -1 });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}