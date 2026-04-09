import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project, Notification } from '@/lib/models';
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

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .populate('assignedTeam.lead', 'name email')
      .populate('assignedTeam.members', 'name email roleType');

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const {
      title,
      description,
      type,
      problem,
      targetUsers,
      features,
      budget,
      timeline,
    } = body;

    if (!title || !description || !type) {
      return NextResponse.json(
        { error: 'Title, description, and type are required' },
        { status: 400 }
      );
    }

    const project = await Project.create({
      clientId: auth.userId,
      title,
      description,
      type,
      status: 'draft',
      proposalDetails: {
        problem: problem || '',
        targetUsers: targetUsers || '',
        features: features || [],
        budget: budget || { min: 0, max: 0, currency: 'USD' },
        timeline: timeline || '',
      },
      activities: [{
        type: 'status_change',
        userId: auth.userId,
        content: 'Project created',
        createdAt: new Date(),
      }],
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}