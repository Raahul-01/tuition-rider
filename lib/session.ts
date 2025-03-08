import "server-only";
import { auth } from "@/auth";
import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { AuthError } from '@/types/auth';

const SESSION_COOKIE_NAME = 'session_token';
const SESSION_DURATION = 3600; // 1 hour in seconds

interface SessionData {
  userId: string;
  role: string;
  createdAt: number;
  expiresAt: number;
}

// Generate secure session token
const generateSessionToken = (userId: string, role: string): string => {
  const timestamp = Date.now();
  const data = `${userId}:${role}:${timestamp}:${process.env.SESSION_SECRET}`;
  return createHash('sha256').update(data).digest('hex');
};

// Create new session
export const createSession = (userId: string, role: string): string => {
  const token = generateSessionToken(userId, role);
  const now = Date.now();

  const sessionData: SessionData = {
    userId,
    role,
    createdAt: now,
    expiresAt: now + (SESSION_DURATION * 1000)
  };

  // Store session data securely
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION,
    path: '/'
  });

  return token;
};

// Validate session
export const validateSession = async (token: string): Promise<SessionData> => {
  try {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    
    if (!sessionCookie || sessionCookie.value !== token) {
      throw new AuthError('INVALID_TOKEN', 'Invalid session token');
    }

    const now = Date.now();
    const session = await getSessionData(token);

    if (!session || session.expiresAt < now) {
      throw new AuthError('INVALID_TOKEN', 'Session expired');
    }

    return session;
  } catch (error) {
    throw new AuthError('INVALID_TOKEN', 'Session validation failed');
  }
};

// Get session data
export const getSessionData = async (token: string): Promise<SessionData | null> => {
  try {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== token) {
      return null;
    }

    // In a real application, you would fetch session data from Redis or another store
    // This is a simplified example
    return null;
  } catch (error) {
    return null;
  }
};

// Destroy session
export const destroySession = () => {
  cookies().delete(SESSION_COOKIE_NAME);
};

// Refresh session
export const refreshSession = async (token: string): Promise<string | null> => {
  try {
    const session = await validateSession(token);
    if (!session) return null;

    // Generate new token
    const newToken = generateSessionToken(session.userId, session.role);
    
    // Update session data
    const now = Date.now();
    const sessionData: SessionData = {
      ...session,
      createdAt: now,
      expiresAt: now + (SESSION_DURATION * 1000)
    };

    // Update cookie
    cookies().set(SESSION_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_DURATION,
      path: '/'
    });

    return newToken;
  } catch (error) {
    return null;
  }
};

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
}