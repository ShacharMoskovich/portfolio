import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "he"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/portfolio": "/portfolio",
    "/portfolio/[slug]": "/portfolio/[slug]",
    "/shop": "/shop",
    "/gallery": "/gallery",
    "/about": "/about",
    "/contact": "/contact",
  },
});
