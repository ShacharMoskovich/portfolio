'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageOrderer } from '@/components/admin/ImageOrderer';
import type { ProjectMeta } from '@/lib/portfolio/types';

export default function EditProjectPage({
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

  const [formData, setFormData] = useState<ProjectMeta | null>(null);
  const [toolInput, setToolInput] = useState('');

  useEffect(() => {
    async function loadProject() {
      const { slug: projectSlug } = await params;
      setSlug(projectSlug);

      try {
        const response = await fetch(`/api/admin/projects`);
        const data = await response.json();
        const project = data.projects.find((p: ProjectMeta) => p.slug === projectSlug);

        if (!project) {
          setError('Project not found');
          return;
        }

        setFormData(project);
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [params]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!formData) {
    return (
      <main className="bg-canvas text-ink min-h-screen">
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-12">
          <p className="text-red-600">{error || 'Project not found'}</p>
          <Link href="/admin/projects" className="text-sm text-ink-secondary hover:text-ink mt-4 inline-block">
            ← Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  const addTool = () => {
  if (toolInput.trim() && formData && !(formData.tools || []).includes(toolInput.trim())) {
    setFormData({
      ...formData,
      tools: [...(formData.tools || []), toolInput.trim()],
      });
      setToolInput('');
    }
  };

  const removeTool = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        tools: formData.tools.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/projects/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update project');
      }

      setSuccess('Project updated successfully!');
      setTimeout(() => {
        router.push('/admin/projects');
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
        <Link href="/admin/projects" className="text-sm text-ink-secondary hover:text-ink mb-8 inline-block">
          ← Back to Projects
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
                <span className="font-medium text-lg">Publish this project</span>
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
                <input
                  type="text"
                  value={formData.slug}
                  disabled
                  className="w-full border border-border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Folder</label>
                <input
                  type="text"
                  name="folder"
                  value={formData.folder}
                  onChange={handleInputChange}
                  className="w-full border border-border rounded px-3 py-2"
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
                    className="w-full border border-border rounded px-3 py-2 h-[42px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured || false}
                    onChange={handleInputChange}
                    className="w-4 h-4 cursor-pointer"
                  />
                  Featured Project
                </label>
              </div>
            </div>
          </section>

          {/* Cloudinary Tag & Image Ordering */}
          <section className="border border-border p-6 rounded bg-blue-50">
            <h2 className="text-lg font-medium mb-4">Gallery Images (Tags & Order)</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Cloudinary Tag</label>
                <input
                  type="text"
                  name="cloudinaryTag"
                  value={(formData as any).cloudinaryTag || ''}
                  onChange={(e) => setFormData({ ...formData, cloudinaryTag: e.target.value } as any)}
                  placeholder="e.g., project-nili"
                  className="w-full border border-border rounded px-3 py-2 bg-white"
                />
                <p className="text-xs text-ink-secondary mt-2">Tag your project gallery files inside Cloudinary using this identifier string.</p>
              </div>

              {/* Image Reorderer */}
              {(formData as any).cloudinaryTag && (
                <div className="border border-border rounded p-4 bg-white">
                  <h3 className="text-sm font-medium mb-4">Reorder Gallery Images</h3>
                  <ImageOrderer
                    tag={(formData as any).cloudinaryTag}
                    currentOrder={(formData as any).imageOrder || ''}
                    onChange={handleImageOrderChange}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Main Display Media */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Main Display Media</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Portfolio Box Image (Full Cloudinary URL)</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleInputChange}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Video Public ID (optional)</label>
                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl || ''}
                  onChange={handleInputChange}
                  placeholder="nili-video"
                  className="w-full border border-border rounded px-3 py-2"
                />
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle (EN)</label>
                <input
                  type="text"
                  value={formData.subtitle.en}
                  onChange={(e) => handleBilingualChange('subtitle', 'en', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (EN)</label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => handleBilingualChange('description', 'en', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2 h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role (EN)</label>
                <input
                  type="text"
                  value={formData.role.en}
                  onChange={(e) => handleBilingualChange('role', 'en', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Award (EN, optional)</label>
                <input
                  type="text"
                  value={formData.award?.en || ''}
                  onChange={(e) => handleBilingualChange('award', 'en', e.target.value)}
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle (HE)</label>
                <input
                  type="text"
                  value={formData.subtitle.he}
                  onChange={(e) => handleBilingualChange('subtitle', 'he', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (HE)</label>
                <textarea
                  value={formData.description.he}
                  onChange={(e) => handleBilingualChange('description', 'he', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2 h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role (HE)</label>
                <input
                  type="text"
                  value={formData.role.he}
                  onChange={(e) => handleBilingualChange('role', 'he', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Award (HE, optional)</label>
                <input
                  type="text"
                  value={formData.award?.he || ''}
                  onChange={(e) => handleBilingualChange('award', 'he', e.target.value)}
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Tools & URL */}
          <section className="border border-border p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Tools & External Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tools</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    placeholder="e.g., Procreate"
                    className="flex-1 border border-border rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={addTool}
                    className="bg-ink text-canvas px-4 py-2 rounded hover:opacity-80"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tools.map((tool, idx) => (
                    <span key={idx} className="bg-border px-3 py-1 rounded text-sm flex items-center gap-2">
                      {tool}
                      <button
                        type="button"
                        onClick={() => removeTool(idx)}
                        className="font-bold hover:opacity-70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">External URL (optional)</label>
                <input
                  type="url"
                  name="externalUrl"
                  value={formData.externalUrl || ''}
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
            disabled={submitting}
            className="w-full bg-ink text-canvas py-3 rounded font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {submitting ? 'Updating...' : 'Update Project'}
          </button>
        </form>
      </div>
    </main>
  );
}