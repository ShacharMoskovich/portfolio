'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ProjectMeta } from '@/lib/portfolio/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  if (loading) return <div className="p-8">Loading projects...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Projects</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/artworks" className="px-4 py-2 border border-border rounded hover:bg-surface text-sm">
            Artworks →
          </Link>
          <Link href="/admin/projects/new" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            New Project
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

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link key={project.slug} href={`/admin/projects/${project.slug}/edit`}>
              <div className="border rounded p-6 hover:bg-gray-50 cursor-pointer transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="font-display text-2xl mb-2">{project.title.en}</h2>
                    {project.subtitle?.en && (
                      <p className="text-sm text-ink-secondary mb-2">{project.subtitle.en}</p>
                    )}
                    <div className="flex gap-4 text-xs">
                      <span className="text-ink-muted">Year: {project.year}</span>
                      <span className="text-ink-muted">Featured: {project.featured ? 'Yes' : 'No'}</span>
                      <span className="text-ink-muted">Published: {project.isPublished ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div
                    className="w-20 h-20 rounded flex-shrink-0"
                    style={{
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
