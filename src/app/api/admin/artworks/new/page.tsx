'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Artwork } from '@/lib/portfolio/types';

export default function CreateArtworkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<Artwork>({
    slug: '',
    year: new Date().getFullYear(),
    accent: '#000000',
    title: { en: '', he: '' },
    description: { en: '', he: '' },
    dimensions: { en: '', he: '' },
    materials: { en: '', he: '' },
    images: [],
    video: '',
  });

  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState({ en: '', he: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const addImage = () => {
    if (imageUrl.trim()) {
      const publicId = imageUrl.split('/').pop() || imageUrl;
      setFormData({
        ...formData,
        images: [
          ...formData.images,
          {
            url: imageUrl,
            publicId,
            caption: imageCaption,
          },
        ],
      });
      setImageUrl('');
      setImageCaption({ en: '', he: '' });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create artwork');
      }

      setSuccess('Artwork created successfully!');
      setTimeout(() => {
        router.push('/admin/artworks');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-canvas text-ink min-h-screen">
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-12">
        <Link href="/admin/artworks" className="text-sm text-ink-secondary hover:text-ink mb-8 inline-block">
          ← Back to Artworks
        </Link>

        <h1 className="font-display text-4xl md:text-5xl mb-12">Create New Artwork</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL name)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full border border-border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full border border-border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accent Color</label>
                  <input
                    type="color"
                    name="accent"
                    value={formData.accent}
                    onChange={handleInputChange}
                    className="w-full border border-border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* English Content */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">English Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (EN)</label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => handleBilingualChange('title', 'en', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (EN)</label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => handleBilingualChange('description', 'en', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2 h-24"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dimensions (EN, optional)</label>
                <input
                  type="text"
                  value={formData.dimensions?.en || ''}
                  onChange={(e) => handleBilingualChange('dimensions', 'en', e.target.value)}
                  placeholder="e.g., 100 x 150 cm"
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Materials (EN, optional)</label>
                <input
                  type="text"
                  value={formData.materials?.en || ''}
                  onChange={(e) => handleBilingualChange('materials', 'en', e.target.value)}
                  placeholder="e.g., Watercolor on paper"
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Hebrew Content */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Hebrew Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (HE)</label>
                <input
                  type="text"
                  value={formData.title.he}
                  onChange={(e) => handleBilingualChange('title', 'he', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (HE)</label>
                <textarea
                  value={formData.description.he}
                  onChange={(e) => handleBilingualChange('description', 'he', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2 h-24"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dimensions (HE, optional)</label>
                <input
                  type="text"
                  value={formData.dimensions?.he || ''}
                  onChange={(e) => handleBilingualChange('dimensions', 'he', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Materials (HE, optional)</label>
                <input
                  type="text"
                  value={formData.materials?.he || ''}
                  onChange={(e) => handleBilingualChange('materials', 'he', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Images & Video</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Add Image URL</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 border border-border rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="bg-ink text-canvas px-4 py-2 rounded hover:opacity-80"
                  >
                    Add
                  </button>
                </div>
                <div className="text-xs text-ink-secondary mb-3">
                  Image Caption (optional):
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    type="text"
                    value={imageCaption.en}
                    onChange={(e) => setImageCaption({ ...imageCaption, en: e.target.value })}
                    placeholder="Caption EN"
                    className="border border-border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={imageCaption.he}
                    onChange={(e) => setImageCaption({ ...imageCaption, he: e.target.value })}
                    placeholder="Caption HE"
                    className="border border-border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Images Added:</label>
                <div className="space-y-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="bg-surface border border-border p-3 rounded flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{img.publicId}</p>
                        {img.caption?.en && <p className="text-xs text-ink-secondary">{img.caption.en}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Video URL (optional)</label>
                <input
                  type="text"
                  name="video"
                  value={formData.video || ''}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-canvas py-3 rounded font-medium hover:opacity-80 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Artwork'}
          </button>
        </form>
      </div>
    </main>
  );
}
