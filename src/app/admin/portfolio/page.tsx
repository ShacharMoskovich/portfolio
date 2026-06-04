import { getProjectSlugs } from "@/lib/portfolio/data";
import Link from "next/link";

export const metadata = { title: "Admin - Projects" };

export default function AdminPortfolioPage() {
  const slugs = getProjectSlugs();

  return (
    <main className="bg-canvas min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-display text-4xl">Projects</h1>
          <form action="/api/admin/logout" method="POST">
            <button className="text-sm text-ink-secondary hover:text-ink">
              Logout
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {slugs.map((slug) => (
            <Link
              key={slug}
              href={`/admin/portfolio/${slug}`}
              className="block p-4 border border-border hover:bg-surface transition-colors"
            >
              <p className="capitalize font-medium">{slug}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
