'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Commission } from '@/lib/portfolio/types';

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const res = await fetch('/api/admin/commissions');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch commissions');
      const data = await res.json();
      setCommissions(data.commissions || []);
    } catch (err) {
      setError('Failed to load commissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  if (loading) return <div className="p-8">Loading commissions...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Commissions</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="px-4 py-2 border border-border rounded hover:bg-surface text-sm">
            Projects →
          </Link>
          <Link href="/admin/artworks" className="px-4 py-2 border border-border rounded hover:bg-surface text-sm">
            Artworks →
          </Link>
          <Link href="/admin/commissions/new" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            New Commission
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-ink-secondary hover:text-ink">
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {commissions.length === 0 ? (
        <p className="text-gray-500">No commissions yet. Click "New Commission" to add one.</p>
      ) : (
        <div className="grid gap-4">
          {commissions.map((commission) => (
            <Link key={commission.slug} href={`/admin/commissions/${commission.slug}/edit`}>
              <div className="border rounded p-6 hover:bg-gray-50 cursor-pointer transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="font-display text-2xl mb-2">{commission.title.en}</h2>
                    <div className="flex gap-4 text-xs">
                      {commission.year && <span className="text-ink-muted">Year: {commission.year}</span>}
                      <span className="text-ink-muted">Tag: {commission.cloudinaryTag || '—'}</span>
                      <span className="text-ink-muted">Published: {commission.isPublished ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  {commission.image && (
                    <div
                      className="w-20 h-20 rounded flex-shrink-0"
                      style={{
                        backgroundImage: `url(${commission.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
