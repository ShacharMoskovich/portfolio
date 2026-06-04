'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Artwork } from '@/lib/portfolio/types';

export default function AdminArtworksListPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const response = await fetch('/api/admin/artworks');
        const data = await response.json();
        setArtworks(data.artworks);
      } catch (err) {
        console.error('Failed to fetch artworks:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArtworks();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="bg-canvas text-ink min-h-screen">
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-display text-4xl md:text-5xl">Artworks</h1>
          <Link
            href="/admin/artworks/new"
            className="bg-ink text-canvas px-6 py-3 rounded font-medium hover:opacity-80"
          >
            + New Artwork
          </Link>
        </div>

        <div className="space-y-4">
          {artworks.map((artwork) => (
            <div
              key={artwork.slug}
              className="border border-border rounded p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h2 className="font-display text-2xl mb-2">{artwork.title.en}</h2>
                <p className="text-sm text-ink-secondary mb-2">{artwork.description.en.substring(0, 100)}...</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-ink-muted">Year: {artwork.year}</span>
                  <span className="text-ink-muted">Images: {artwork.images.length}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/artworks/${artwork.slug}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </Link>
                <Link
                  href={`/en/gallery/${artwork.slug}`}
                  className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
                  target="_blank"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>

        {artworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ink-secondary mb-6">No artworks yet</p>
            <Link
              href="/admin/artworks/new"
              className="bg-ink text-canvas px-6 py-3 rounded font-medium hover:opacity-80 inline-block"
            >
              Create First Artwork
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
