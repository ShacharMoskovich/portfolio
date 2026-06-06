import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

// Simple global rate limiter (in-memory, resets on restart)
const globalHits = new Map<string, { count: number; resetAt: number }>();
const GLOBAL_LIMIT = 120;
const GLOBAL_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = globalHits.get(ip);
  if (!entry || now > entry.resetAt) {
    globalHits.set(ip, { count: 1, resetAt: now + GLOBAL_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > GLOBAL_LIMIT;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log('MIDDLEWARE RUNNING:', pathname);  // ← add this line

  /*
  // ---- Protect /admin PAGES (not the login page itself) ----
  // This is a UX/defense-in-depth gate: it redirects unauthenticated users
  // away from admin screens. The REAL cryptographic check happens in the
  // /api/admin route handlers via requireAdmin(). Never rely on this alone.
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const hasCookie = Boolean(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!hasCookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }
*/

  // Skip the rest of the middleware for API/static/internal routes.
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Global rate limiting for page navigation.
  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // Geo-based locale detection: Israeli IP -> Hebrew.
  const country = req.headers.get("x-vercel-ip-country");
  const hasLocalePrefix =
    pathname.startsWith("/he") || pathname.startsWith("/en");

  if (!hasLocalePrefix && country && !pathname.startsWith("/admin")) {
    const locale = country === "IL" ? "he" : "en";
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  // Note: /admin is now matched so we can gate it. /api is still excluded
  // (route handlers guard themselves via requireAdmin()).
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};
