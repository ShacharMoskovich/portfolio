import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProject, getProjectSlugs } from "@/lib/portfolio/data";
import type { Locale } from "@/lib/portfolio/types";
import Link from "next/link";
import { ProjectGalleryLightbox } from "@/components/portfolio/ProjectGalleryLightbox";

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({
    slug,
    locale: "en",
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title[locale],
    description: project.description[locale],
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const project = getProject(slug);

  if (!project) notFound();

  const allSlugs = getProjectSlugs();
  const idx = allSlugs.indexOf(slug);
  const prev = idx > 0 ? getProject(allSlugs[idx - 1]) : null;
  const next = idx < allSlugs.length - 1 ? getProject(allSlugs[idx + 1]) : null;

  const isRtl = locale === "he";

  return (
    <main className="bg-canvas text-ink min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-site mx-auto px-5 md:px-10">
        <Link
          href={`/${locale}/portfolio`}
          className="inline-flex items-center gap-2 pt-8 text-sm text-ink-secondary hover:text-ink transition-colors"
        >
          <span>{t("backToAll")}</span>
        </Link>

        {/* GALLERY & INFO SECTION */}
        <section className="grid md:grid-cols-12 gap-12 py-12 md:py-20">
          
          {/* LEFT: Complete Info Column */}
          <div className="md:col-span-4 space-y-8">
            {project.award && (
              <div
                className="inline-block px-3 py-2 rounded text-xs tracking-[0.22em] uppercase font-medium"
                style={{ backgroundColor: project.accent + "22", color: project.accent }}
              >
                {project.award[locale]}
              </div>
            )}
            
            <h1
              className={`font-display text-5xl md:text-6xl leading-[0.92] tracking-tight ${
                isRtl ? "font-display-he" : ""
              }`}
            >
              {project.title[locale]}
            </h1>

            <p className="text-lg text-ink-secondary leading-relaxed font-medium">
              {project.subtitle[locale]}
            </p>

            {/* DESCRIPTION MOVED HERE */}
            <div className="space-y-4 text-base leading-relaxed text-ink/90">
              {(typeof project.description[locale] === "string"
                ? [project.description[locale]]
                : project.description[locale]
              ).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* METADATA BLOCK */}
            <div className="space-y-6 pt-8 border-t border-border">
              <div>
                <p className="text-base text-ink-secondary">{project.year}</p>
              </div>
              <div>
                <p className="text-base font-medium">{project.role[locale]}</p>
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs tracking-[0.05em] uppercase border border-border px-2 py-1 rounded bg-surface"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              {project.externalUrl && (
                <div className="pt-2">
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex gap-2 text-sm font-medium border-b border-current pb-1 hover:opacity-70 transition-opacity"
                  >
                    <span>{t("viewLive")}</span>
                    <span>↗</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Gallery Component */}
          <div className="md:col-span-8">
            <ProjectGalleryLightbox slug={project.slug} isAdmin={false} />
          </div>
        </section>

        {/* NAVIGATION - Previous / Next Project */}
        <nav className="grid md:grid-cols-2 gap-8 py-12 md:py-16 border-t border-border mt-8">
          {prev ? (
            <Link href={`/${locale}/portfolio/${prev.slug}`} className="group">
              <h3
                className={`font-display text-3xl group-hover:text-accent transition-colors ${
                  isRtl ? "font-display-he" : ""
                }`}
              >
                {prev.title[locale]}
              </h3>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/${locale}/portfolio/${next.slug}`}
              className="group text-end md:col-start-2"
            >
              <h3
                className={`font-display text-3xl group-hover:text-accent transition-colors ${
                  isRtl ? "font-display-he" : ""
                }`}
              >
                {next.title[locale]}
              </h3>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </main>
  );
}