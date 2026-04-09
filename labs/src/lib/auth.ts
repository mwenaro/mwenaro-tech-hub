import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { User } from './models';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  roleType?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function generateTokens(user: { _id: string; email: string; role: string; roleType?: string }): TokenPair {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    roleType: user.roleType,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user._id.toString() }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function setAuthCookies(tokenPair: TokenPair) {
  const cookieStore = await cookies();
  
  cookieStore.set('access_token', tokenPair.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  cookieStore.set('refresh_token', tokenPair.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function getAuthFromCookies() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const payload = verifyAccessToken(accessToken);
  if (payload) {
    return payload;
  }

  const refreshPayload = verifyRefreshToken(refreshToken);
  if (!refreshPayload) {
    return null;
  }

  const user = await User.findById(refreshPayload.userId);
  if (!user) {
    return null;
  }

  const newTokens = generateTokens(user);
  await setAuthCookies(newTokens);

  return verifyAccessToken(newTokens.accessToken);
}

export async function getCurrentUser() {
  const payload = await getAuthFromCookies();
  if (!payload) {
    return null;
  }

  const user = await User.findById(payload.userId);
  return user;
}