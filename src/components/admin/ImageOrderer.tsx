'use client';

import { useEffect, useState } from 'react';

interface Image {
  url: string;
  publicId: string;
}

interface ImageOrdererProps {
  tag: string;
  currentOrder: string; // comma-separated public IDs
  onChange: (newOrder: string) => void;
}

export function ImageOrderer({ tag, currentOrder, onChange }: ImageOrdererProps) {
  const [orderedImages, setOrderedImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Fetch images by tag
  useEffect(() => {
    async function fetchImages() {
      if (!tag) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/cloudinary/tag?tag=${encodeURIComponent(tag)}`);
        const data = await response.json();
        const fetchedImages = data.images || [];

        // Sort by current order if exists
        if (currentOrder) {
          const orderList = currentOrder.split(',').map(id => id.trim());
          const sorted = [...fetchedImages].sort((a, b) => {
            const indexA = orderList.indexOf(a.publicId);
            const indexB = orderList.indexOf(b.publicId);
            const orderA = indexA === -1 ? 999 : indexA;
            const orderB = indexB === -1 ? 999 : indexB;
            return orderA - orderB;
          });
          setOrderedImages(sorted);
        } else {
          setOrderedImages(fetchedImages);
        }
      } catch (err) {
        console.error('Failed to fetch images:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [tag]);

  // Update onChange when orderedImages changes
  useEffect(() => {
    const newOrder = orderedImages.map(img => img.publicId).join(',');
    onChange(newOrder);
  }, [orderedImages]);

  const handleDragStart = (e: React.DragEvent, publicId: string) => {
    setDraggedItem(publicId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPublicId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetPublicId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = orderedImages.findIndex(img => img.publicId === draggedItem);
    const targetIndex = orderedImages.findIndex(img => img.publicId === targetPublicId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newOrdered = [...orderedImages];
    const [draggedImg] = newOrdered.splice(draggedIndex, 1);
    newOrdered.splice(targetIndex, 0, draggedImg);

    setOrderedImages(newOrdered);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading images...</div>;
  }

  if (orderedImages.length === 0) {
    return <div className="text-center py-8 text-ink-secondary">No images found for this tag</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-secondary">Drag images to reorder them. The order will be saved automatically.</p>
      
      <div className="grid grid-cols-3 gap-3">
        {orderedImages.map((img, idx) => (
          <div
            key={img.publicId}
            draggable
            onDragStart={(e) => handleDragStart(e, img.publicId)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, img.publicId)}
            onDragEnd={handleDragEnd}
            className={`relative cursor-move group transition-all ${
              draggedItem === img.publicId ? 'opacity-50' : ''
            }`}
          >
            {/* Image */}
            <div className="aspect-square rounded border-2 border-border overflow-hidden bg-surface hover:border-ink transition-all">
              <img
                src={img.url}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Order Badge */}
            <div className="absolute top-2 left-2 bg-ink text-canvas rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {idx + 1}
            </div>

            {/* Public ID Label */}
            <p className="mt-2 text-xs text-ink-muted truncate" title={img.publicId}>
              {img.publicId}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}