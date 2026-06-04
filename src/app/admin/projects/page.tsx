'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ProjectMeta } from '@/lib/portfolio/types';

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/admin/projects');
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="bg-canvas text-ink min-h-screen">
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-display text-4xl md:text-5xl">Projects</h1>
          <Link
            href="/admin/projects/new"
            className="bg-ink text-canvas px-6 py-3 rounded font-medium hover:opacity-80"
          >
            + New Project
          </Link>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="border border-border rounded p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h2 className="font-display text-2xl mb-2">{project.title.en}</h2>
                <p className="text-sm text-ink-secondary mb-2">{project.subtitle.en}</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-ink-muted">Year: {project.year}</span>
                  <span className="text-ink-muted">Featured: {project.featured ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/projects/${project.slug}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </Link>
                <Link
                  href={`/en/portfolio/${project.slug}`}
                  className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
                  target="_blank"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ink-secondary mb-6">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="bg-ink text-canvas px-6 py-3 rounded font-medium hover:opacity-80 inline-block"
            >
              Create First Project
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
