import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';
import { getAuthFromCookies } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const team = await User.find({ role: 'team' }).sort({ createdAt: -1 });

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, email, password, roleType } = body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const member = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'team',
      roleType,
      isActive: true,
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Create team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}