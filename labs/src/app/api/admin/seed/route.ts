import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      return NextResponse.json({ 
        message: 'Admin already exists',
        admin: { email: adminExists.email, name: adminExists.name }
      });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Password', 12);

    const admin = await User.create({
      email: 'admin@labs.mwenaro.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: { email: admin.email, name: admin.name }
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}