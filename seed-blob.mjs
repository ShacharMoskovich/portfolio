/**
 * seed-blob.mjs — Run once to upload your current JSON files to Vercel Blob.
 *
 * Usage:  node seed-blob.mjs
 * Reads BLOB_READ_WRITE_TOKEN from .env.local (no extra packages needed).
 */
import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

// --- Load BLOB_READ_WRITE_TOKEN from .env.local (simple manual parser) ---
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  try {
    const env = readFileSync('.env.local', 'utf-8');
    for (const line of env.split('\n')) {
      const m = line.match(/^\s*BLOB_READ_WRITE_TOKEN\s*=\s*(.+)\s*$/);
      if (m) {
        process.env.BLOB_READ_WRITE_TOKEN = m[1].replace(/^["']|["']$/g, '').trim();
        break;
      }
    }
  } catch {
    /* .env.local not found */
  }
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌  BLOB_READ_WRITE_TOKEN not found in .env.local');
  process.exit(1);
}

async function seed(localPath, blobKey) {
  const content = readFileSync(localPath, 'utf-8');
  const result = await put(blobKey, content, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
  console.log(`✅  ${blobKey} → ${result.url}`);
}

console.log('Seeding Vercel Blob...\n');
await seed('public/artworks.json', 'data/artworks.json');
await seed('public/projects.json', 'data/projects.json');
await seed('public/commissions.json', 'data/commissions.json');
console.log('\nDone! Your blob store now has the latest data.');
