/**
 * seed-kv.mjs — One-time load of local JSON into Upstash Redis.
 * SAFE: only seeds a key if it's empty/missing (won't wipe existing data).
 *
 * Usage:  node seed-kv.mjs
 */
import { Redis } from '@upstash/redis';
import { readFileSync } from 'fs';

// Load env vars from .env.local
try {
  const env = readFileSync('.env.local', 'utf-8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
} catch {}

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) {
  console.error('❌  Redis env vars not found (KV_REST_API_URL / KV_REST_API_TOKEN). Run `vercel env pull .env.local` first.');
  process.exit(1);
}

const redis = new Redis({ url, token });

async function seedIfEmpty(localPath, key) {
  const existing = await redis.get(key);
  if (Array.isArray(existing) && existing.length > 0) {
    console.log(`⏭️   ${key} already has ${existing.length} item(s) — kept.`);
    return;
  }
  const data = JSON.parse(readFileSync(localPath, 'utf-8'));
  await redis.set(key, data);
  console.log(`✅   Seeded ${key} (${data.length} item(s)).`);
}

console.log('Seeding Redis...\n');
await seedIfEmpty('public/artworks.json', 'artworks');
await seedIfEmpty('public/projects.json', 'projects');
await seedIfEmpty('public/commissions.json', 'commissions');
 await seedIfEmpty('public/shop.json', 'shop');
console.log('\nDone.');
