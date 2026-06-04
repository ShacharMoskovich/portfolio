'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageOrderer } from '@/components/admin/ImageOrderer';
import type { Artwork } from '@/lib/portfolio/types';

export default function EditArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<Artwork | null>(null);

  useEffect(() => {
    async function loadArtwork() {
      const { slug: artworkSlug } = await params;
      setSlug(artworkSlug);

      try {
        const response = await fetch(`/api/admin/artworks`);
        const data = await response.json();
        const artworksArray = data.artworks || (Array.isArray(data) ? data : []);
        const artwork = artworksArray.find((a: Artwork) => a.slug === artworkSlug);

        if (!artwork) {
          setError('Artwork not found');
          return;
        }

        setFormData(artwork);
      } catch (err) {
        setError('Failed to load artwork');
      } finally {
        setLoading(false);
      }
    }

    loadArtwork();
  }, [params]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!formData) {
    return (
      <main className="bg-canvas text-ink min-h-screen">
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-12">
          <p className="text-red-600">{error || 'Artwork not found'}</p>
          <Link href="/admin/artworks" className="text-sm text-ink-secondary hover:text-ink mt-4 inline-block">
            ← Back to Artworks
          </Link>
        </div>
      </main>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked } as any);
  };

  const handleBilingualChange = (field: string, lang: 'en' | 'he', value: string) => {
    setFormData({
      ...formData,
      [field]: {
        ...(formData as any)[field],
        [lang]: value,
      },
    });
  };

  const handleImageOrderChange = (newOrder: string) => {
    setFormData({ ...formData, imageOrder: newOrder } as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/artworks/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update artwork');
      }

      setSuccess('Artwork updated successfully!');
      setTimeout(() => {
        router.push('/admin/artworks');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-canvas text-ink min-h-screen">
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-12">
        <Link href="/admin/artworks" className="text-sm text-ink-secondary hover:text-ink mb-8 inline-block">
          ← Back to Artworks
        </Link>

        <h1 className="font-display text-4xl md:text-5xl mb-12">Edit {formData.title.en}</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Publish Status */}
          <section className="border-2 border-purple-400 bg-purple-50 p-6 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={(formData as any).isPublished || false}
                onChange={handleCheckboxChange}
                className="w-5 h-5 cursor-pointer"
              />
              <label htmlFor="isPublished" className="cursor-pointer">
                <span className="font-medium text-lg">Publish this artwork</span>
                <p className="text-sm text-ink-secondary mt-1">
                  {(formData as any).isPublished
                    ? '✅ Published - visible to everyone'
                    : '❌ Draft - hidden from public'}
                </p>
              </label>
            </div>
          </section>

          {/* Basic Info */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Slug (cannot be changed)</label>
                <input type="text" value={formData.slug} disabled className="w-full border border-border rounded px-3 py-2 bg-gray-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full border border-border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accent Color</label>
                  <input type="color" name="accent" value={formData.accent} onChange={handleInputChange} className="w-full border border-border rounded px-3 py-2" />
                </div>
              </div>
            </div>
          </section>

          {/* Cloudinary Tag & Image Ordering */}
          <section className="border border-border p-6 rounded bg-blue-50">
            <h2 className="text-lg font-medium mb-4">Images Source & Order</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Cloudinary Tag</label>
                <input
                  type="text"
                  name="cloudinaryTag"
                  value={(formData as any).cloudinaryTag || ''}
                  onChange={(e) => setFormData({ ...formData, cloudinaryTag: e.target.value } as any)}
                  placeholder="e.g., purple-lady"
                  className="w-full border border-border rounded px-3 py-2"
                />
                <p className="text-xs text-ink-secondary mt-2">Tag your images in Cloudinary with this tag name.</p>
              </div>

              {/* Image Reorderer */}
              {(formData as any).cloudinaryTag && (
                <div className="border border-border rounded p-4 bg-white">
                  <h3 className="text-sm font-medium mb-4">Reorder Images</h3>
                  <ImageOrderer
                    tag={(formData as any).cloudinaryTag}
                    currentOrder={(formData as any).imageOrder || ''}
                    onChange={handleImageOrderChange}
                  />
                </div>
              )}
            </div>
          </section>

          {/* English Content */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">English Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (EN)</label>
                <input type="text" value={formData.title.en} onChange={(e) => handleBilingualChange('title', 'en', e.target.value)} className="w-full border border-border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (EN)</label>
                <textarea value={formData.description.en} onChange={(e) => handleBilingualChange('description', 'en', e.target.value)} className="w-full border border-border rounded px-3 py-2 h-24" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dimensions (EN, optional)</label>
                <input type="text" value={formData.dimensions?.en || ''} onChange={(e) => handleBilingualChange('dimensions', 'en', e.target.value)} className="w-full border border-border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Materials (EN, optional)</label>
                <input type="text" value={formData.materials?.en || ''} onChange={(e) => handleBilingualChange('materials', 'en', e.target.value)} className="w-full border border-border rounded px-3 py-2" />
              </div>
            </div>
          </section>

          {/* Hebrew Content */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Hebrew Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (HE)</label>
                <input type="text" value={formData.title.he} onChange={(e) => handleBilingualChange('title', 'he', e.target.value)} className="w-full border border-border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (HE)</label>
                <textarea value={formData.description.he} onChange={(e) => handleBilingualChange('description', 'he', e.target.value)} className="w-full border border-border rounded px-3 py-2 h-24" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dimensions (HE, optional)</label>
                <input type="text" value={formData.dimensions?.he || ''} onChange={(e) => handleBilingualChange('dimensions', 'he', e.target.value)} className="w-full border border-border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Materials (HE, optional)</label>
                <input type="text" value={formData.materials?.he || ''} onChange={(e) => handleBilingualChange('materials', 'he', e.target.value)} className="w-full border border-border rounded px-3 py-2" />
              </div>
            </div>
          </section>

          {/* Submit */}
          <button type="submit" disabled={submitting} className="w-full bg-ink text-canvas py-3 rounded font-medium hover:opacity-80 disabled:opacity-50">
            {submitting ? 'Updating...' : 'Update Artwork'}
          </button>
        </form>
      </div>
    </main>
  );
}