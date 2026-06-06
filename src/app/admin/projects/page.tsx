import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { checkPassword, createSessionToken, ADMIN_COOKIE } from "@/lib/auth";

export const metadata = { title: "Admin Login" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params?.error === "1";

  async function handleLogin(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "");

    // Validate the password directly — no self-fetch to the API route,
    // which avoids the VERCEL_URL (missing protocol) crash.
    if (!checkPassword(password)) {
      redirect("/admin/login?error=1");
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 12, // 12h, matches token TTL
    });

    redirect("/admin/portfolio");
  }

  return (
    <main className="bg-canvas min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-12">
          <h1 className="font-display text-4xl mb-2">Admin</h1>
          <p className="text-sm text-ink-secondary">Enter your password to continue</p>
        </div>
        {hasError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            Incorrect password. Please try again.
          </div>
        )}
        <form action={handleLogin} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-surface border border-border px-4 py-3 text-ink text-sm placeholder-ink-muted focus:outline-none focus:border-accent"
            required
          />
          <button
            type="submit"
            className="w-full bg-ink text-canvas py-3 text-sm font-medium uppercase tracking-wider hover:bg-accent transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}