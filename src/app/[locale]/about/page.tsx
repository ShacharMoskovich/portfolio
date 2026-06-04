import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/portfolio/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  return { title: t("aboutTitle"), description: "About Shachar" };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const isRtl = locale === "he";

  // 👇 PASTE YOUR CLOUDINARY IMAGE URL HERE
  const aboutImage = "https://res.cloudinary.com/dwhfkwjxo/image/upload/v1780483759/profilePic.jpg";

  const bio = locale === "he"
    ? [
        "אני מעצבת גרפית, מאיירת ויוצרת חזותית. ",
        "בשנים האחרונות הייתי דוקטורנטית למדעי המוח, ולאחר שנים בהם למדתי קורסים חישוביים, הייתי מרצה בקורס מתמטי וחקרתי במעבדה, הבנתי שהתשוקה האמיתית שלי היא אומנות ועיצוב. ",
        "בעבודותיי אני משלבת בין האהבה שלי לאסתטיקה ותחכום, ואני נמשכת אל הקווים הנקיים והמדויקים. ",
        "פתוחה לעבודות מיתוג ועיצוב, הזמנות איורים אישיים, וכן איור חי באירועים.",
      ]
    : [
        "A graphic designer, illustrator and visual creator, based in Israel. ",
        "In recent years, I perused a PhD in Computational Neuroscience. After years of studying, leading a mathematical methods course, and conducting research in the lab, I realized that my true passion lies in visual art and design. ",
        "My work combines my love for aesthetics and sophistication, and I am drawn to clean, accurate linework. ",
        "Open to brand and graphic design commissions, and custom illustrations. ",
      ];

  return (
    <main className="bg-canvas text-ink min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <section className="max-w-site mx-auto px-5 md:px-10 pt-24 md:pt-32 pb-14 md:pb-20">
        <div className="grid md:grid-cols-12 gap-y-12 md:gap-x-12">
          <div className="md:col-span-5">
            {aboutImage ? (
              <img
                src={aboutImage}
                alt="Shachar"
                className="w-full h-auto rounded border border-border"
              />
            ) : (
              <div className="aspect-[4/5] bg-surface border border-border rounded" />
            )}
          </div>
          <div className="md:col-span-7">
            <p className="text-xs tracking-[0.22em] uppercase text-ink-secondary" dir="ltr">
              {t("aboutEyebrow")}
            </p>
            <h1 className={`mt-5 font-display text-5xl md:text-7xl leading-[0.95] tracking-tight ${isRtl ? "font-display-he" : ""}`}>
              {t("aboutTitle")}
            </h1>
            <div className={`mt-8 space-y-4 text-lg leading-relaxed ${isRtl ? "font-body-he" : "font-body"}`}>
              {bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-site mx-auto px-5 md:px-10 pb-24 md:pb-32 border-t border-border pt-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-ink-muted mb-3">
              {t("skillTools")}
            </p>
            <p className="text-sm leading-relaxed">Adobe Illustrator, Procreate, Figma, Canva</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-ink-muted mb-3">
              {t("skillLanguages")}
            </p>
            <p className="text-sm leading-relaxed">{t("skillLanguagesVal")}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-ink-muted mb-3">
              {t("skillBackground")}
            </p>
            <p className="text-sm leading-relaxed">{t("skillBackgroundVal")}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-ink-muted mb-3">
              {t("skillShown")}
            </p>
            <p className="text-sm leading-relaxed">{t("skillShownVal")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
