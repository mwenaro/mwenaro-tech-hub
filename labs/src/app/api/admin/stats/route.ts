import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, Project, Payment } from '@/lib/models';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [totalClients, totalProjects, activeProjects, completedProjects, pendingProposals, payments] = await Promise.all([
      User.countDocuments({ role: 'client', isActive: true }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'active' }),
      Project.countDocuments({ status: 'completed' }),
      Project.countDocuments({ status: { $in: ['submitted', 'under_review'] } }),
      Payment.find({ status: 'paid' }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const stats = {
      totalClients,
      totalProjects,
      activeProjects,
      completedProjects,
      totalRevenue,
      pendingProposals,
    };

    const recentProjects = await Project.find()
      .populate('clientId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({ stats, recentProjects });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}