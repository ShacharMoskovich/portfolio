'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Artwork {
  slug: string;
  title: { en: string; he: string };
  description: { en: string; he: string };
  dimensions?: { en: string; he: string };
  materials?: { en: string; he: string };
  year?: number;
  images: Array<{ url: string; publicId?: string }>;
  video?: string;
  cloudinaryTag?: string;
  cloudinaryFolder?: string;
  imageOrder?: string;
  isPublished?: boolean;
  mainImageIndex?: number;
  accent?: string;
}

export default function EditArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>('');
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<Array<{ url: string; publicId?: string }>>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);
      fetchArtwork(p.slug);
    });
  }, [params]);

  const fetchArtwork = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/artworks/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch artwork');
      const data = await res.json();
      if (data && data.title) {
        setArtwork(data);
        setImages(data.images || []);
        setMainImageIndex(data.mainImageIndex ?? 0);
      } else {
        setError('Invalid artwork data');
      }
    } catch (err) {
      setError('Failed to load artwork');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artwork) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/artworks/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...artwork,
          images,
          mainImageIndex,
        }),
      });

      if (!res.ok) throw new Error('Failed to update artwork');
      router.push('/admin/artworks');
    } catch (err) {
      setError('Failed to update artwork');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${artwork?.title?.en}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/artworks/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete artwork');
      router.push('/admin/artworks');
    } catch (err) {
      setError('Failed to delete artwork');
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading artwork...</div>;
  if (!artwork || !artwork.title) return <div className="p-8 text-center text-red-600">Artwork not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <a href="/admin/artworks" className="text-ink-secondary hover:text-ink mb-6 block">
        ← Back to Artworks
      </a>

      <h1 className="text-4xl font-bold mb-8">Edit {artwork?.title?.en || 'Artwork'}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* PUBLISH SECTION */}
        <div className="border-2 border-purple-400 rounded-lg p-6 bg-purple-50">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={artwork?.isPublished ?? false}
              onChange={(e) => setArtwork(artwork ? { ...artwork, isPublished: e.target.checked } : null)}
              className="w-5 h-5 accent-purple-600"
            />
            <span className="font-bold text-purple-700">Publish this artwork</span>
          </label>
          {artwork?.isPublished && (
            <p className="text-green-600 text-sm mt-2">✓ Published - visible to everyone</p>
          )}
        </div>

        {/* MAIN IMAGE SELECTOR */}
        {images && images.length > 0 && (
          <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
            <h2 className="font-bold text-blue-700 mb-4">📸 Select Main Gallery Image</h2>
            <p className="text-sm text-blue-600 mb-4">Click an image to set it as the gallery thumbnail</p>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img?.url || ''}
                    alt={`Image ${idx + 1}`}
                    className={`w-full aspect-square object-cover rounded border-2 cursor-pointer transition ${
                      mainImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-300 hover:border-blue-500'
                    }`}
                    onClick={() => setMainImageIndex(idx)}
                  />
                  {mainImageIndex === idx && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      ★
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setMainImageIndex(idx)}
                    className={`w-full mt-2 py-1 rounded text-xs font-medium transition ${
                      mainImageIndex === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    {mainImageIndex === idx ? 'Main ★' : 'Set Main'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BASIC INFO */}
        <div>
          <h3 className="font-bold mb-3">Basic Information</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title (English)"
              value={artwork?.title?.en || ''}
              onChange={(e) => setArtwork(artwork ? { ...artwork, title: { ...artwork.title, en: e.target.value } } : null)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Title (Hebrew)"
              value={artwork?.title?.he || ''}
              onChange={(e) => setArtwork(artwork ? { ...artwork, title: { ...artwork.title, he: e.target.value } } : null)}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Year"
              value={artwork?.year || ''}
              onChange={(e) => setArtwork(artwork ? { ...artwork, year: e.target.value ? parseInt(e.target.value) : undefined } : null)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Cloudinary Tag"
              value={artwork?.cloudinaryTag || ''}
              onChange={(e) => setArtwork(artwork ? { ...artwork, cloudinaryTag: e.target.value } : null)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <h3 className="font-bold mb-3">Description</h3>
          <textarea
            placeholder="Description (English)"
            value={artwork?.description?.en || ''}
            onChange={(e) => setArtwork(artwork ? { ...artwork, description: { ...artwork.description, en: e.target.value } } : null)}
            className="w-full p-2 border rounded"
            rows={3}
          />
          <textarea
            placeholder="Description (Hebrew)"
            value={artwork?.description?.he || ''}
            onChange={(e) => setArtwork(artwork ? { ...artwork, description: { ...artwork.description, he: e.target.value } } : null)}
            className="w-full p-2 border rounded mt-2"
            rows={3}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}