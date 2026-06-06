/**
 * blob-data.ts — Vercel Blob read/write for artworks and projects.
 *
 * Uses a PUBLIC blob store (the data is public website content).
 * Falls back to the local JSON files when BLOB_READ_WRITE_TOKEN is not set
 * (i.e. local development without a Blob store configured).
 */
import { put, list } from '@vercel/blob';
import type { Artwork, ProjectMeta } from './portfolio/types';

// Build-time fallbacks (bundled into the function at deploy time).
import artworksFallback from '../../public/artworks.json';
import projectsFallback from '../../public/projects.json';

const ARTWORKS_KEY = 'data/artworks.json';
const PROJECTS_KEY = 'data/projects.json';

async function readBlob<T>(key: string, fallback: T[]): Promise<T[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return fallback; // local dev with no Blob store
  }
  try {
    const { blobs } = await list({ prefix: key, limit: 1 });
    if (!blobs.length) return fallback; // store empty (pre-seed)
    // cache:'no-store' so our function always asks for the current version.
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return fallback;
    return (await res.json()) as T[];
  } catch {
    return fallback;
  }
}

async function writeBlob(key: string, data: unknown): Promise<void> {
  await put(key, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,   // keep a stable, predictable pathname
    allowOverwrite: true,     // REQUIRED: we overwrite the same file on every save
    contentType: 'application/json',
    cacheControlMaxAge: 60,   // edits propagate within ~60s (the minimum allowed)
  });
}

// ---- Public API --------------------------------------------------------

export async function getArtworks(): Promise<Artwork[]> {
  return readBlob<Artwork>(ARTWORKS_KEY, artworksFallback as Artwork[]);
}

export async function saveArtworks(artworks: Artwork[]): Promise<void> {
  await writeBlob(ARTWORKS_KEY, artworks);
}

export async function getProjects(): Promise<ProjectMeta[]> {
  return readBlob<ProjectMeta>(PROJECTS_KEY, projectsFallback as ProjectMeta[]);
}

export async function saveProjects(projects: ProjectMeta[]): Promise<void> {
  await writeBlob(PROJECTS_KEY, projects);
}
