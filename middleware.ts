import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

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

async function hmac(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  // This is the line that was likely missing or misconfigured!
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isAdminAuthorized(req: NextRequest): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const cookie = req.cookies.get("shachar_admin")?.value;
  if (!cookie) return false;
  const expected = await hmac("admin", secret);
  if (cookie.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < cookie.length; i++) {
    diff |= cookie.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/portfolio") || pathname === "/api/admin/logout") {
    const isLoginPage = pathname === "/admin/login" || pathname === "/api/admin/login";
    if (!isLoginPage) {
      const ok = await isAdminAuthorized(req);
      if (!ok) {
        if (pathname.startsWith("/api/")) {
          return new NextResponse(
            JSON.stringify({ ok: false, error: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          );
        }
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const country = req.headers.get("x-vercel-ip-country");
  const hasLocalePrefix =
    pathname.startsWith("/he") || pathname.startsWith("/en");

  if (!hasLocalePrefix && country) {
    const locale = country === "IL" ? "he" : "en";
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|static|.*\\..*).*)", "/"],
};
