import type { Locale } from "@/lib/portfolio/types";

export const metadata = {
  title: "Shop",
  description: "Shop",
};

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "he";

  return (
    <main className="bg-canvas text-ink min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <section className="max-w-site mx-auto px-5 md:px-10 py-24 md:py-32">
        <p className="text-center text-ink-secondary">Coming soon</p>
      </section>
    </main>
  );
}
