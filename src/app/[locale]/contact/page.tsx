import type { Locale } from "@/lib/portfolio/types";

export const metadata = {
  title: "Contact",
  description: "Get in touch",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "he";

  const title = locale === "he" ? "דברו איתי" : "Let's talk";
  const emailLabel = locale === "he" ? "אימייל" : "Email";
  const nameLabel = locale === "he" ? "שם" : "Name";
  const messageLabel = locale === "he" ? "הודעה" : "Message";
  const submitLabel = locale === "he" ? "שלח" : "Send";

  return (
    <main className="bg-canvas text-ink min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <section className="max-w-2xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <h1 className={`font-display text-5xl md:text-7xl leading-[0.95] tracking-tight mb-12 text-center ${isRtl ? "font-display-he" : ""}`}>
          {title}
        </h1>

        <form className="space-y-6" action="mailto:moskovicher93@gmail.com" method="POST" encType="text/plain">
          <div>
            <label className="block text-sm font-medium mb-2">{nameLabel}</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-border rounded px-4 py-3 bg-canvas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{emailLabel}</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-border rounded px-4 py-3 bg-canvas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{messageLabel}</label>
            <textarea
              name="message"
              rows={6}
              required
              className="w-full border border-border rounded px-4 py-3 bg-canvas"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-ink text-canvas py-3 rounded font-medium hover:opacity-80 transition-opacity"
          >
            {submitLabel}
          </button>
        </form>

        
      </section>
    </main>
  );
}
