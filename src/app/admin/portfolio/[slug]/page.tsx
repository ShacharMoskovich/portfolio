import { notFound } from "next/navigation";
import { getProject } from "@/lib/portfolio/data";

export const metadata = { title: "Admin - Manage Project" };

export default async function AdminProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <main className="bg-canvas min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl mb-2">{project.title.en}</h1>
        <p className="text-sm text-ink-secondary mb-8">Upload images for this project</p>

        <div className="bg-surface border border-border p-8 mb-8">
          <p className="text-sm text-ink-secondary mb-4">
            Image upload interface will appear here. For now, use Cloudinary's Media Library directly.
          </p>
          <div className="aspect-video bg-[#f0ebe6] border border-border flex items-center justify-center text-ink-muted">
            Upload UI placeholder
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href={`/en/portfolio/${slug}`}
            className="text-sm text-accent hover:underline"
          >
            View EN page
          </a>
          <a
            href={`/he/portfolio/${slug}`}
            className="text-sm text-accent hover:underline"
          >
            View HE page
          </a>
        </div>
      </div>
    </main>
  );
}
