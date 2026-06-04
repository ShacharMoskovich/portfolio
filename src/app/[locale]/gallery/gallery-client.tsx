'use client';

import { useEffect, useState } from 'react';

interface GalleryClientProps {
  slug: string;
  isAdmin: boolean;
}

interface GalleryImage {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  caption?: string;
  resourceType: 'image' | 'video';
}

export function GalleryClient({ slug }: GalleryClientProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch(`/api/gallery/${slug}`);
        const data = await response.json();
        
        // API returns { images: [...], success: true }
        const items = data.images || data.resources || data.data || [];
        setImages(items);
      } catch (err) {
        console.error('Failed to load gallery:', err);
        setError('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-12 text-ink-secondary">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (images.length === 0) {
    return <div className="text-center py-12 text-ink-secondary">No images yet</div>;
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
      {images.map((image, idx) => (
        <div key={`${image.publicId}-${idx}`} className="break-inside-avoid">
          {image.resourceType === 'video' ? (
            <video
              src={image.url.replace('/image/upload/', '/video/upload/').replace(/\.[^.]+$/, '.mp4')}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full rounded border border-border"
              style={{ aspectRatio: '9/16' }}
            />
          ) : (
            <img
              src={image.url}
              alt={image.caption || 'Gallery image'}
              className="w-full rounded border border-border"
            />
          )}
        </div>
      ))}
    </div>
  );
}
