import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';
import { getAuthFromCookies } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { email, name, company } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const inviteCode = uuidv4();
    const inviteExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await User.create({
      email: email.toLowerCase(),
      name,
      company: company || '',
      role: 'client',
      isActive: false,
      invitedBy: auth.userId,
      inviteCode,
      inviteExpiry,
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_LABS_URL}/register?invite=${inviteCode}`;
    
    // TODO: Send invite email
    
    return NextResponse.json({
      success: true,
      inviteLink,
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteCode, email, password, name, company, phone } = body;

    if (!inviteCode || !email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      inviteCode 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid invitation' },
        { status: 400 }
      );
    }

    if (user.inviteExpiry && user.inviteExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.name = name;
    user.company = company || '';
    user.phone = phone || '';
    user.isActive = true;
    user.inviteCode = undefined;
    user.inviteExpiry = undefined;

    await user.save();

    return NextResponse.json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Accept invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}