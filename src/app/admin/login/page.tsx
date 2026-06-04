import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";
    const password = formData.get("password");
    const res = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        const cookieStore = await cookies();
  
        // Safely extract the token name and value
        const [nameValue] = setCookie.split(";");
        const [name, value] = nameValue.split("=");
              
        // Use the approved cookie jar API instead of modifying headers directly
        cookieStore.set(name.trim(), value.trim(), {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
      }
      redirect("/admin/portfolio");
    }
  }

  return (
    <main className="bg-canvas min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-12">
          <h1 className="font-display text-4xl mb-2">Admin</h1>
          <p className="text-sm text-ink-secondary">Enter your password to continue</p>
        </div>
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
