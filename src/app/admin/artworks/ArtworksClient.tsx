'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { Artwork } from '@/lib/portfolio/types';

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; slug: string; title: string }>({
    isOpen: false,
    slug: '',
    title: '',
  });
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchArtworks();
  }, []);

  async function fetchArtworks() {
    try {
      const response = await fetch('/api/admin/artworks');
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await response.json();
      setArtworks(data.artworks || []);
    } catch (err) {
      setError('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  }

  const openDeleteDialog = (slug: string, title: string) => {
    setDeleteConfirm({ isOpen: true, slug, title });
  };

  const closeDeleteDialog = () => {
    setDeleteConfirm({ isOpen: false, slug: '', title: '' });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.slug) return;

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/artworks/${deleteConfirm.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete artwork');
      }

      setSuccess(`"${deleteConfirm.title}" deleted successfully!`);
      closeDeleteDialog();
      fetchArtworks();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete artwork');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-canvas text-ink min-h-screen">
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-12">
          <p>Loading artworks...</p>
        </div>
      </main>
    );
  }

  const publishedCount = artworks.filter((a: any) => a.isPublished).length;
  const draftCount = artworks.length - publishedCount;

  return (
    <main className="bg-canvas text-ink min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">Artworks</h1>
            <p className="text-sm text-ink-secondary mt-2">
              {publishedCount} published • {draftCount} draft
            </p>
          </div>
          <Link href="/admin/artworks/new" className="bg-ink text-canvas px-4 py-2 rounded hover:opacity-80">
            + New Artwork
          </Link>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}

        {artworks.length === 0 ? (
          <p className="text-ink-secondary">No artworks yet. <Link href="/admin/artworks/new" className="text-ink underline">Create one</Link></p>
        ) : (
          <div className="space-y-3">
            {artworks.map((artwork) => (
              <div key={artwork.slug} className="border border-border rounded p-4 flex items-center justify-between hover:bg-surface transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-lg">{artwork.title.en}</h3>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      (artwork as any).isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {(artwork as any).isPublished ? '✓ Published' : '○ Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-ink-secondary">{artwork.title.he}</p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/artworks/${artwork.slug}/edit`}
                    className="px-3 py-1 text-sm bg-ink text-canvas rounded hover:opacity-80"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => openDeleteDialog(artwork.slug, artwork.title.en)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Artwork?"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </main>
  );
}