/**
 * blob-data.ts — Data layer backed by Upstash Redis (Vercel Marketplace).
 *
 * Redis is strongly consistent: a value written is immediately readable.
 * (Vercel Blob was eventually consistent on overwrites, which caused saved
 * edits to disappear — this replaces it.)
 *
 * Falls back to the local JSON files when Redis env vars are absent
 * (i.e. local development without the integration configured).
 */
import { Redis } from '@upstash/redis';
import type { Artwork, ProjectMeta, Commission } from './portfolio/types';

// Build-time fallbacks (used only when Redis isn't configured).
import artworksFallback from '../../public/artworks.json';
import projectsFallback from '../../public/projects.json';
import commissionsFallback from '../../public/commissions.json';

const ARTWORKS_KEY = 'artworks';
const PROJECTS_KEY = 'projects';
const COMMISSIONS_KEY = 'commissions';

// The Upstash/Vercel integration injects KV_REST_API_* ; the bare Upstash
// integration injects UPSTASH_REDIS_REST_* . Support both.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

async function read<T>(key: string, fallback: T[]): Promise<T[]> {
  if (!redis) return fallback; // local dev without Redis configured
  try {
    const data = await redis.get<T[]>(key);
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
}

async function write<T>(key: string, data: T[]): Promise<void> {
  if (!redis) return;
  await redis.set(key, data);
}

// ---- Public API (unchanged signatures) ---------------------------------

export async function getArtworks(): Promise<Artwork[]> {
  return read<Artwork>(ARTWORKS_KEY, artworksFallback as Artwork[]);
}

export async function saveArtworks(artworks: Artwork[]): Promise<void> {
  await write(ARTWORKS_KEY, artworks);
}

export async function getProjects(): Promise<ProjectMeta[]> {
  return read<ProjectMeta>(PROJECTS_KEY, projectsFallback as ProjectMeta[]);
}

export async function saveProjects(projects: ProjectMeta[]): Promise<void> {
  await write(PROJECTS_KEY, projects);
}

export async function getCommissions(): Promise<Commission[]> {
  return read<Commission>(COMMISSIONS_KEY, commissionsFallback as Commission[]);
}

export async function saveCommissions(commissions: Commission[]): Promise<void> {
  await write(COMMISSIONS_KEY, commissions);
}