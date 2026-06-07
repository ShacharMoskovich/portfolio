/**
 * seed-blob.mjs — ONE-TIME initial seed of Vercel Blob from local JSON.
 *
 * SAFE TO RE-RUN: it will NOT overwrite a blob that already has data.
 * Your admin edits (main images, new commissions, captions) live ONLY in
 * Blob — this script will never clobber them.
 *
 * Usage:  node seed-blob.mjs
 */
import { put, get } from '@vercel/blob';
import { readFileSync } from 'fs';

// Load token from .env.local (no extra packages)
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  try {
    const env = readFileSync('.env.local', 'utf-8');
    for (const line of env.split('\n')) {
      const m = line.match(/^\s*BLOB_READ_WRITE_TOKEN\s*=\s*(.+)\s*$/);
      if (m) { process.env.BLOB_READ_WRITE_TOKEN = m[1].replace(/^["']|["']$/g, '').trim(); break; }
    }
  } catch {}
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌  BLOB_READ_WRITE_TOKEN not found in .env.local');
  process.exit(1);
}

async function seedIfEmpty(localPath, blobKey) {
  // If the blob already exists and has items, DO NOT overwrite.
  try {
    const existing = await get(blobKey, { access: 'private' });
    if (existing && existing.statusCode === 200) {
      const text = await new Response(existing.stream).text();
      const data = JSON.parse(text);
      if (Array.isArray(data) && data.length > 0) {
        console.log(`⏭️   ${blobKey} already has ${data.length} item(s) — skipping (kept your data).`);
        return;
      }
    }
  } catch {
    // not found — safe to seed
  }
  const content = readFileSync(localPath, 'utf-8');
  await put(blobKey, content, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
  console.log(`✅   Seeded ${blobKey} from ${localPath}`);
}

console.log('Seeding Vercel Blob (safe mode)...\n');
await seedIfEmpty('public/artworks.json', 'data/artworks.json');
await seedIfEmpty('public/projects.json', 'data/projects.json');
await seedIfEmpty('public/commissions.json', 'data/commissions.json');
console.log('\nDone. Existing data was preserved.');
