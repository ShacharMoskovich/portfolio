import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { checkPassword, createSessionToken, ADMIN_COOKIE } from '@/lib/auth';

// Simple in-memory login throttle (per IP). Resets on cold start, which is
// fine as a speed bump. For stronger protection use Upstash/Redis.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || 'unknown';
}

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string): void {
  const entry = attempts.get(ip);
  if (entry) entry.count++;
}

export async function POST(req: Request) {
  const ip = getIp(req);

  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429 }
    );
  }

  let password = '';
  try {
    const body = await req.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!checkPassword(password)) {
    recordFailure(ip);
    // Deliberately vague message — don't confirm whether the user exists, etc.
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,                 // JS can't read it -> XSS can't steal it
    secure: true,                   // HTTPS only
    sameSite: 'strict',             // blocks CSRF on admin mutations
    path: '/',
    maxAge: 60 * 60 * 12,           // 12h, matches token TTL
  });
  return res;
}

// Logout: clear the cookie.
export async function DELETE() {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: true, path: '/', maxAge: 0 });
  return res;
}
