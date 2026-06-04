import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // CUSTOM DISPLAY FONTS
        "display": ["Tushiaeng", "serif"], // English titles
        "display-he": ["Tushia2", "serif"], // Hebrew titles
        // NEUTRAL BODY FONTS
        "body": ["DM Sans", "sans-serif"], // English body
        "body-he": ["Heebo", "sans-serif"], // Hebrew body
      },
      colors: {
        canvas: "#f5f3f0",
        surface: "#faf9f8",
        border: "#e0dcd8",
        ink: "#1a1a18",
        "ink-secondary": "#6b6b68",
        "ink-muted": "#a0a09d",
        accent: "#8C5A2B",
      },
      maxWidth: {
        site: "1400px",
      },
      fontSize: {
        "display-sm": ["2.5rem", { lineHeight: "1" }],
        "display-md": ["3.5rem", { lineHeight: "1" }],
        "display-lg": ["4.5rem", { lineHeight: "1" }],
      },
    },
  },
  plugins: [],
};

export default config;