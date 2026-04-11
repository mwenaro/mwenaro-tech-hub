import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await clearAuthCookies();
    // Native HTML forms expect a redirect, not JSON, otherwise they stay on the API URL
    return NextResponse.redirect(new URL('/login', req.url), { status: 302 });
  } catch (error) {
    console.error('Logout error:', error);
    // Even if an error happens, redirect to login to aggressively eject the user
    return NextResponse.redirect(new URL('/login', req.url), { status: 302 });
  }
}