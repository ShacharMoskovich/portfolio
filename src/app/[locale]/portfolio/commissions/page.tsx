import type { Locale } from "@/lib/portfolio/types";
import { getCommissions, getProjects } from "@/lib/blob-data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CommissionsListPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "he";

  const allProjects = await getProjects();
  const intro = allProjects.find((p: any) => p.slug === "commissions");

  const allCommissions = await getCommissions();
  const commissions = allCommissions.filter((c: any) => c.isPublished === true);

  return (
    <main className="bg-canvas text-ink min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-site mx-auto px-5 md:px-10">
        <Link href={`/${locale}/portfolio`} className="inline-flex items-center gap-2 pt-8 text-sm text-ink-secondary hover:text-ink transition-colors">
          ← {locale === "he" ? "חזרה לעבודות" : "Back to Work"}
        </Link>

        {/* Intro */}
        <div className="py-12 md:py-16 border-b border-border">
          <h1 className={`font-display text-5xl md:text-6xl leading-[0.92] tracking-tight mb-6 ${isRtl ? "font-display-he" : ""}`}>
            {intro?.title?.[locale] || (locale === "he" ? "הזמנות אישיות" : "Commissions")}
          </h1>
          {intro?.description?.[locale] && (
            <p className="text-base md:text-lg leading-relaxed text-ink-secondary max-w-2xl">
              {intro.description[locale]}
            </p>
          )}
        </div>

        {/* Grid of commissions */}
        <div className="py-12 md:py-20">
          {commissions.length === 0 ? (
            <p className="text-ink-secondary">
              {locale === "he" ? "אין עדיין הזמנות שפורסמו" : "No commissions published yet."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {commissions.map((commission: any) => (
                <Link key={commission.slug} href={`/${locale}/portfolio/commissions/${commission.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="rounded border border-border overflow-hidden bg-surface aspect-square shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
                      {commission.image ? (
                        <img src={commission.image} alt={commission.title[locale]} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-surface to-ink-muted flex items-center justify-center">
                          <span className="text-ink-secondary text-sm">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className={`text-white text-center px-4 font-medium text-lg md:text-xl ${commission.title[locale].match(/[\u0590-\u05FF]/) ? 'font-display-he' : 'font-display'}`}>
                          {commission.title[locale]}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
