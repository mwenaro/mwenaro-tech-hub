import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/invite', '/', '/about', '/contact', '/icon.svg', '/sitemap.xml', '/robots.txt'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  const cookieStore = request.cookies;
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken && !refreshToken) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/projects') || pathname.startsWith('/payments')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, JWT_SECRET) as { role: string };
      
      if (pathname.startsWith('/admin') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      return NextResponse.next();
    } catch {
      if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/projects') || pathname.startsWith('/payments')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};