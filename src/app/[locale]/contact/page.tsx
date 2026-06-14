import type { Locale } from "@/lib/portfolio/types";
import { ContactForm } from "@/components/contact/ContactForm";

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
  const labels = {
    name: locale === "he" ? "שם" : "Name",
    email: locale === "he" ? "אימייל" : "Email",
    message: locale === "he" ? "הודעה" : "Message",
    submit: locale === "he" ? "שלח" : "Send",
    sending: locale === "he" ? "שולח..." : "Sending...",
    success: locale === "he" ? "תודה! ההודעה נשלחה." : "Thanks! Your message was sent.",
    error: locale === "he" ? "משהו השתבש. נסו שוב." : "Something went wrong. Please try again.",
  };

  return (
    <main className="bg-canvas text-ink min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <section className="max-w-2xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <h1 className={`font-display text-5xl md:text-7xl leading-[0.95] tracking-tight mb-12 text-center ${isRtl ? "font-display-he" : ""}`}>
          {title}
        </h1>
        <ContactForm labels={labels} />
      </section>
    </main>
  );
}
