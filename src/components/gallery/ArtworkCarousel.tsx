'use client';

import { useEffect, useState } from 'react';

interface CarouselProps {
  tag: string;
  imageOrder?: string; // comma-separated public IDs: "img1,img2,img3"
}

interface CarouselImage {
  url: string;
  publicId: string;
}

export function ArtworkCarousel({ tag, imageOrder }: CarouselProps) {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        // Use the PUBLIC gallery endpoint (returns { images }), not the
        // auth-protected /api/cloudinary/tag route.
        const response = await fetch(`/api/gallery/${encodeURIComponent(tag)}`);
        const data = await response.json();
        let fetchedImages = data.images || [];

        // Sort by manual order if provided
        if (imageOrder) {
          const orderList = imageOrder.split(',').map(id => id.trim());
          fetchedImages.sort((a: CarouselImage, b: CarouselImage) => {
            const indexA = orderList.indexOf(a.publicId);
            const indexB = orderList.indexOf(b.publicId);
            // Images not in order list go to the end
            const orderA = indexA === -1 ? 999 : indexA;
            const orderB = indexB === -1 ? 999 : indexB;
            return orderA - orderB;
          });
        }

        setImages(fetchedImages);
      } catch (err) {
        console.error('Failed to fetch images:', err);
      } finally {
        setLoading(false);
      }
    }

    if (tag) {
      fetchImages();
    }
  }, [tag, imageOrder]);

  // Auto-rotate effect
  useEffect(() => {
    if (images.length === 0 || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length, isPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return <div className="w-full h-96 bg-surface rounded border border-border flex items-center justify-center">Loading...</div>;
  }

  if (images.length === 0) {
    return <div className="w-full h-96 bg-surface rounded border border-border flex items-center justify-center text-ink-secondary">No images found for this tag</div>;
  }

  const currentImage = images[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="rounded border border-border overflow-hidden bg-surface relative group">
        <img src={currentImage.url} alt="Artwork" className="w-full h-auto" />
        
        {/* Controls Overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <button
            onClick={handlePrev}
            disabled={images.length <= 1}
            className="bg-white/80 hover:bg-white text-ink rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-xl"
            aria-label="Previous image"
          >
            ❮
          </button>
          <button
            onClick={togglePlay}
            className="bg-white/80 hover:bg-white text-ink rounded-full p-2 transition-all font-bold text-xl"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={handleNext}
            disabled={images.length <= 1}
            className="bg-white/80 hover:bg-white text-ink rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-xl"
            aria-label="Next image"
          >
            ❯
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`aspect-square rounded overflow-hidden border-2 transition-all hover:opacity-80 ${
                idx === currentIndex ? 'border-ink' : 'border-border'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            >
              <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Counter & Status */}
      {images.length > 1 && (
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>
            {currentIndex + 1} / {images.length}
          </span>
          <span>{isPlaying ? '▶ Auto-playing' : '⏸ Paused'}</span>
        </div>
      )}
    </div>
  );
}
