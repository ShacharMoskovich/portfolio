'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageOrderer } from '@/components/admin/ImageOrderer';

export default function NewCommissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    slug: '',
    year: new Date().getFullYear(),
    accent: '#000000',
    image: '',
    cloudinaryTag: '',
    imageOrder: '',
    title: { en: '', he: '' },
    description: { en: '', he: '' },
    isPublished: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleBilingualChange = (field: string, lang: 'en' | 'he', value: string) => {
    setFormData({ ...formData, [field]: { ...(formData as any)[field], [lang]: value } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create commission');

      setSuccess('Commission created successfully!');
      setTimeout(() => router.push('/admin/commissions'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-canvas text-ink min-h-screen">
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-12">
        <Link href="/admin/commissions" className="text-sm text-ink-secondary hover:text-ink mb-8 inline-block">
          ← Back to Commissions
        </Link>

        <h1 className="font-display text-4xl md:text-5xl mb-12">Create New Commission</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Publish */}
          <section className="border-2 border-purple-400 bg-purple-50 p-6 rounded">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isPublished" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} className="w-5 h-5 cursor-pointer" />
              <label htmlFor="isPublished" className="cursor-pointer">
                <span className="font-medium text-lg">Publish this commission</span>
                <p className="text-sm text-ink-secondary mt-1">{formData.isPublished ? '✅ Published - visible to everyone' : '❌ Draft - hidden from public'}</p>
              </label>
            </div>
          </section>

          {/* Basic Info */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL name, no spaces)</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="w-full border border-border rounded px-3 py-2" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full border border-border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accent Color</label>
                  <input type="color" name="accent" value={formData.accent} onChange={handleInputChange} className="w-full border border-border rounded px-3 py-2 h-[42px]" />
                </div>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Gallery Images</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cloudinary Tag (images with this tag form the gallery)</label>
                <input type="text" name="cloudinaryTag" value={formData.cloudinaryTag} onChange={handleInputChange} className="w-full border border-border rounded px-3 py-2" placeholder="e.g., commission-smith-portrait" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Card Preview Image (Full Cloudinary URL)</label>
                <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://res.cloudinary.com/..." className="w-full border border-border rounded px-3 py-2" />
              </div>
              {formData.cloudinaryTag && (
                <div className="border border-border rounded p-4 bg-white">
                  <h3 className="text-sm font-medium mb-4">Reorder Gallery Images</h3>
                  <ImageOrderer tag={formData.cloudinaryTag} currentOrder={formData.imageOrder} onChange={(o) => setFormData({ ...formData, imageOrder: o })} />
                </div>
              )}
            </div>
          </section>

          {/* English */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">English Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (EN)</label>
                <input type="text" value={formData.title.en} onChange={(e) => handleBilingualChange('title', 'en', e.target.value)} className="w-full border border-border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (EN)</label>
                <textarea value={formData.description.en} onChange={(e) => handleBilingualChange('description', 'en', e.target.value)} className="w-full border border-border rounded px-3 py-2 h-24" required />
              </div>
            </div>
          </section>

          {/* Hebrew */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Hebrew Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (HE)</label>
                <input type="text" value={formData.title.he} onChange={(e) => handleBilingualChange('title', 'he', e.target.value)} className="w-full border border-border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (HE)</label>
                <textarea value={formData.description.he} onChange={(e) => handleBilingualChange('description', 'he', e.target.value)} className="w-full border border-border rounded px-3 py-2 h-24" required />
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="w-full bg-ink text-canvas py-3 rounded font-medium hover:opacity-80 disabled:opacity-50 transition-opacity">
            {loading ? 'Creating...' : 'Create Commission'}
          </button>
        </form>
      </div>
    </main>
  );
}
