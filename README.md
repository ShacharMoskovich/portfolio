# Shachar Moskovich Portfolio

A Next.js portfolio website with bilingual support (EN/HE), Cloudinary image hosting, and admin interface.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local`:**
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ADMIN_PASSWORD=your-password
   ADMIN_SECRET=random-32-character-string
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Visit:** http://localhost:3000

## Editing Content

- **Project descriptions:** `src/lib/portfolio/data.ts`
- **UI text:** `messages/en.json` and `messages/he.json`
- **Colors/fonts:** `tailwind.config.ts`

## Deployment

Deploy to Vercel:
```bash
git push origin main
```

Vercel auto-detects Next.js and deploys automatically. Add environment variables in Vercel dashboard.

## Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **Images:** Cloudinary
- **i18n:** next-intl
- **Language:** TypeScript + React

See LAUNCH_MANUAL.md for comprehensive setup guide.
