import type { Locale } from "@/lib/portfolio/types";
import Link from "next/link";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "he";

  let artworks = [];
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/artworks`, {
      cache: "no-store",
    });
    const data = await res.json();
    // Filter only published artworks
    if (data.artworks && Array.isArray(data.artworks)) {
      artworks = data.artworks.filter((a: any) => a.isPublished === true);
    }
  } catch (err) {
    console.error("Failed to fetch artworks:", err);
  }

  return (
    <main className="bg-canvas text-ink min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-site mx-auto px-5 md:px-10">
        <div className="py-12 md:py-20">
          <h1 className={`font-display text-6xl md:text-7xl leading-[0.92] tracking-tight mb-12 md:mb-16 ${
            isRtl ? "font-display-he" : ""
          }`}>
            {locale === "he" ? "גלריה" : "Gallery"}
          </h1>

          {artworks.length === 0 ? (
            <p className="text-ink-secondary">{locale === "he" ? "אין יצירות פורסומות עדיין" : "No artworks published yet"}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {artworks.map((artwork: any) => {
                // Get the main image index (defaults to 0)
                const mainIndex = artwork.mainImageIndex ?? 0;
                const mainImage = artwork.images && artwork.images[mainIndex];

                return (
                  <Link key={artwork.slug} href={`/${locale}/gallery/${artwork.slug}`}>
                    <div className="group cursor-pointer">
                      {/* Shadow Box - Image with Title on Hover */}
                      <div className="rounded border border-border overflow-hidden bg-surface aspect-square shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
                        {mainImage ? (
                          <img
                            src={mainImage.url}
                            alt={artwork.title[locale]}
                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                          />
                        ) : artwork.images && artwork.images[0] ? (
                          <img
                            src={artwork.images[0].url}
                            alt={artwork.title[locale]}
                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-surface to-ink-muted flex items-center justify-center">
                            <span className="text-ink-secondary text-sm">No image</span>
                          </div>
                        )}

                        {/* Title Overlay - Appears on Hover */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className={`text-white text-center px-4 font-medium text-lg md:text-xl ${
                            artwork.title[locale].match(/[\u0590-\u05FF]/) ? 'font-display-he' : 'font-display'
                          }`}>
                            {artwork.title[locale]}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}