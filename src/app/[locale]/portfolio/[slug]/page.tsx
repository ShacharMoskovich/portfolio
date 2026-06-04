import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/portfolio/types';

async function getProject(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/projects/${slug}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: Locale }> }) {
  const { slug, locale } = await params;
  const project = await getProject(slug);

  if (!project) return { title: 'Not found' };

  return {
    title: project.title[locale],
    description: project.subtitle?.[locale] || project.description[locale],
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const isRtl = locale === 'he';
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-canvas text-ink min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-site mx-auto px-5 md:px-10">
        {/* HEADER SECTION */}
        <div className="py-12 md:py-20 border-b border-border">
          <h1 className={`font-display text-5xl md:text-6xl leading-[0.92] tracking-tight mb-6 md:mb-8 ${
            isRtl ? 'font-display-he' : ''
          }`}>
            {project.title[locale]}
          </h1>

          {project.award?.[locale] && (
            <div
              className="inline-block px-3 py-2 rounded text-xs tracking-[0.22em] uppercase font-medium"
              style={{ backgroundColor: project.accent + '22', color: project.accent }}
            >
              {project.award[locale]}
            </div>
          )}
        </div>

        {/* MAIN CONTENT SECTION */}
        <div className="py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-8 md:gap-12">
            {/* IMAGE */}
            <div className="md:col-span-4">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title[locale]}
                  className="w-full rounded border border-border"
                />
              )}
            </div>

            {/* TEXT */}
            <div className="md:col-span-4 space-y-8">
              {/* SUBTITLE */}
              {project.subtitle?.[locale] && (
                <p className="text-lg text-ink-secondary leading-relaxed font-medium">
                  {project.subtitle[locale]}
                </p>
              )}

              {/* DESCRIPTION */}
              <p className="text-base leading-relaxed text-ink">
                {project.description[locale]}
              </p>

              {/* DETAILS */}
              <div className="space-y-6 pt-8 border-t border-border">
                {/* YEAR */}
                {project.year && (
                  <div>
                    <p className="text-base text-ink-secondary">{project.year}</p>
                  </div>
                )}

                {/* ROLE */}
                {project.role?.[locale] && (
                  <div>
                    <p className="text-base font-medium">{project.role[locale]}</p>
                  </div>
                )}

                {/* TOOLS */}
                {project.tools && project.tools.length > 0 && (
                  <div>
                    <p className="text-sm text-ink-secondary">{project.tools.join(' · ')}</p>
                  </div>
                )}
              </div>

              {/* EXTERNAL LINK */}
              {project.externalUrl && (
                <div className="pt-4">
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:underline font-medium"
                  >
                    View Project →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}