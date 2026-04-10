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

export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { projectId, ...updates } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.clientId.toString() !== auth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const canEdit = ['draft', 'pending', 'rejected'].includes(project.status);
    if (!canEdit) {
      return NextResponse.json({ error: 'Project cannot be edited in current status' }, { status: 400 });
    }

    if (project.status === 'draft') {
      await Project.findByIdAndUpdate(projectId, {
        $set: {
          title: updates.title,
          description: updates.description,
          type: updates.type,
          proposalDetails: updates.proposalDetails,
          status: 'pending',
        },
        $push: {
          activities: {
            type: 'status_change',
            userId: auth.userId,
            content: 'Project submitted for review',
            createdAt: new Date(),
          },
        },
      });
    } else {
      await Project.findByIdAndUpdate(projectId, {
        $set: {
          'pendingChanges.title': updates.title,
          'pendingChanges.description': updates.description,
          'pendingChanges.proposalDetails': updates.proposalDetails,
          'pendingChanges.submittedAt': new Date(),
        },
        $push: {
          activities: {
            type: 'feature_update',
            userId: auth.userId,
            content: 'Changes submitted for approval',
            createdAt: new Date(),
          },
        },
      });
    }

    const updated = await Project.findById(projectId);
    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}