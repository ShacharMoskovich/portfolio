/**
 * blob-data.ts — Vercel Blob read/write for artworks and projects.
 *
 * Uses a PRIVATE blob store (requires token for access).
 * Falls back to the local JSON files when BLOB_READ_WRITE_TOKEN is not set
 * (i.e. local development without a Blob store configured).
 */
import { put, get } from '@vercel/blob';
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
    const result = await get(key, { access: 'private' });
    if (!result || result.statusCode !== 200) return fallback;
    
    // Read from the stream
    const reader = result.stream.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;
    
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) chunks.push(value);
      done = streamDone;
    }
    
    const text = new TextDecoder().decode(
      new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []))
    );
    return JSON.parse(text) as T[];
  } catch {
    return fallback;
  }
}

async function writeBlob(key: string, data: unknown): Promise<void> {
  await put(key, JSON.stringify(data, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
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