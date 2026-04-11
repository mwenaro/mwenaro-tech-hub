import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project, Template, Notification } from '@/lib/models';
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
    const pendingChanges = searchParams.get('pendingChanges');

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }
    if (pendingChanges === 'true') {
      query['pendingChanges.submittedAt'] = { $exists: true, $ne: null };
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

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { projectId, action, status, rejectReason } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (action === 'approveChanges' && project.pendingChanges?.submittedAt) {
      const changes = project.pendingChanges;
      
      await Project.findByIdAndUpdate(projectId, {
        $set: {
          title: changes.title || project.title,
          description: changes.description || project.description,
          proposalDetails: changes.proposalDetails || project.proposalDetails,
          pendingChanges: undefined,
          status: 'pending',
        },
        $push: {
          activities: {
            type: 'status_change',
            userId: auth.userId,
            content: 'Client changes approved and applied',
            createdAt: new Date(),
          },
        },
      });

      await Notification.create({
        userId: project.clientId,
        type: 'project_update',
        title: 'Changes Approved',
        message: `Your changes to "${changes.title || project.title}" have been approved.`,
        link: `/projects/${projectId}`,
      });

      return NextResponse.json({ success: true, message: 'Changes approved' });
    }

    if (action === 'rejectChanges' && project.pendingChanges?.submittedAt) {
      await Project.findByIdAndUpdate(projectId, {
        $set: {
          pendingChanges: undefined,
        },
        $push: {
          activities: {
            type: 'status_change',
            userId: auth.userId,
            content: `Client changes rejected: ${rejectReason || 'No reason provided'}`,
            createdAt: new Date(),
          },
        },
      });

      await Notification.create({
        userId: project.clientId,
        type: 'project_update',
        title: 'Changes Rejected',
        message: `Your changes to "${project.title}" have been rejected. ${rejectReason || ''}`,
        link: `/projects/${projectId}`,
      });

      return NextResponse.json({ success: true, message: 'Changes rejected' });
    }

    if (action === 'updateStatus' && status) {
      const statusUpdate: Record<string, unknown> = { status };
      
      if (status === 'active') {
        statusUpdate['timeline.startDate'] = new Date();
      }

      await Project.findByIdAndUpdate(projectId, {
        $set: statusUpdate,
        $push: {
          activities: {
            type: 'status_change',
            userId: auth.userId,
            content: `Project status changed to ${status}`,
            createdAt: new Date(),
          },
        },
      });

      if (['accepted', 'rejected'].includes(status)) {
        await Notification.create({
          userId: project.clientId,
          type: 'project_update',
          title: status === 'accepted' ? 'Project Accepted' : 'Project Rejected',
          message: status === 'accepted' 
            ? `Your project "${project.title}" has been accepted!`
            : `Your project "${project.title}" was not approved at this time.`,
          link: `/projects/${projectId}`,
        });
      }

      return NextResponse.json({ success: true, message: 'Status updated' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}