import { redirect } from "next/navigation";
import type { Locale } from "@/lib/portfolio/types";

export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  // This instantly forwards anyone hitting /en or /he directly to your portfolio!
  // If you prefer your Shop to be the home page later, just change "portfolio" to "shop"
  redirect(`/${locale}/portfolio`);
}