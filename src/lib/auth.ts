import crypto from 'crypto';
import { cookies } from 'next/headers';

// Name of the session cookie. Keep in sync with your login route.
export const ADMIN_COOKIE = 'shachar_admin';

// How long a login session stays valid.
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 32) {
    // Fail loudly in dev if the secret is missing or too short.
    throw new Error('ADMIN_SECRET is missing or too short (need >= 32 chars).');
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

/**
 * Creates a signed, expiring session token.
 * Format: "admin:<expiryMs>:<hmacSignature>"
 * The signature can only be produced with ADMIN_SECRET, so the token
 * cannot be forged by someone who only knows the cookie name.
 */
export function createSessionToken(): string {
  const expires = Date.now() + TOKEN_TTL_MS;
  const payload = `admin:${expires}`;
  return `${payload}:${sign(payload)}`;
}

/** Verifies a session token's signature AND expiry in constant time. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const parts = token.split(':');
  if (parts.length !== 3) return false;

  const [role, expiresStr, providedSig] = parts;
  const payload = `${role}:${expiresStr}`;
  const expectedSig = sign(payload);

  // Constant-time signature comparison (prevents timing attacks).
  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  return role === 'admin';
}

/**
 * Constant-time password check. Use this in your login route instead of
 * `input === process.env.ADMIN_PASSWORD`, which leaks timing information.
 */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? '';
  // Hash both sides to a fixed length so timingSafeEqual never throws on
  // length mismatch and length itself isn't leaked.
  const a = crypto.createHash('sha256').update(input).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b) && expected.length > 0;
}

/**
 * Call at the top of every /api/admin route. Returns true if the request
 * carries a valid admin session.
 *
 *   if (!(await requireAdmin())) {
 *     return Response.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 */
export async function requireAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}
