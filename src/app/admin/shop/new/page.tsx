'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    slug: '', price: '', available: true, accent: '#000000', image: '', cloudinaryTag: '', imageOrder: '',
    title: { en: '', he: '' }, description: { en: '', he: '' }, isPublished: false,
  });

  const bil = (field: string, lang: 'en' | 'he', v: string) =>
    setForm({ ...form, [field]: { ...(form as any)[field], [lang]: v } });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/shop', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally { setLoading(false); }
  };

  return (
    <main className="bg-canvas text-ink min-h-screen">
      <div className="max-w-2xl mx-auto px-5 md:px-10 py-12">
        <Link href="/admin" className="text-sm text-ink-secondary hover:text-ink mb-8 inline-block">← Back to Dashboard</Link>
        <h1 className="font-display text-4xl mb-10">New Product</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        <form onSubmit={submit} className="space-y-5">
          <label className="flex items-center gap-3 border-2 border-purple-400 bg-purple-50 p-4 rounded cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="w-5 h-5" />
            <span className="font-medium">{form.isPublished ? '✅ Published' : '❌ Draft'}</span>
          </label>
          <input type="text" placeholder="Slug (URL, no spaces)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full p-2 border rounded" required />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Price (e.g. ₪120)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full p-2 border rounded" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> In stock</label>
          </div>
          <input type="text" placeholder="Cloudinary Tag (gallery images)" value={form.cloudinaryTag} onChange={(e) => setForm({ ...form, cloudinaryTag: e.target.value })} className="w-full p-2 border rounded" />
          <input type="url" placeholder="Card image URL (Cloudinary)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Title (EN)" value={form.title.en} onChange={(e) => bil('title', 'en', e.target.value)} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Title (HE)" value={form.title.he} onChange={(e) => bil('title', 'he', e.target.value)} className="w-full p-2 border rounded" required />
          <textarea placeholder="Description (EN)" value={form.description.en} onChange={(e) => bil('description', 'en', e.target.value)} className="w-full p-2 border rounded" rows={3} required />
          <textarea placeholder="Description (HE)" value={form.description.he} onChange={(e) => bil('description', 'he', e.target.value)} className="w-full p-2 border rounded" rows={3} required />
          <button type="submit" disabled={loading} className="w-full bg-ink text-canvas py-3 rounded font-medium hover:opacity-80 disabled:opacity-50">{loading ? 'Creating...' : 'Create Product'}</button>
        </form>
      </div>
    </main>
  );
}
