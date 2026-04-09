import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project, Comment, Payment } from '@/lib/models';
import { getAuthFromCookies } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    await connectDB();

    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      $or: [
        { clientId: auth.userId },
        ...(auth.role === 'admin' ? [{}] : []),
        ...(auth.role === 'team' ? [{ 'assignedTeam.members': auth.userId }] : []),
      ],
    })
      .populate('clientId', 'name email company')
      .populate('assignedTeam.lead', 'name email roleType')
      .populate('assignedTeam.members', 'name email roleType');

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const comments = await Comment.find({ projectId: project._id })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    const payments = await Payment.find({ projectId: project._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ project, comments, payments });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const project = await Project.findByIdAndUpdate(
      id,
      {
        ...body,
        $push: {
          activities: {
            type: 'status_change',
            userId: auth.userId,
            content: `Project ${body.status ? `status changed to ${body.status}` : 'updated'}`,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}