export type Locale = "en" | "he";

export interface LocalizedText {
  en: string;
  he: string;
}

// ==========================================
// ARTWORK TYPES (for gallery artworks)
// ==========================================

export interface ArtworkImage {
  url: string;
  publicId?: string;
}

export interface Artwork {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  dimensions?: LocalizedText;
  materials?: LocalizedText;
  year?: number;
  images: ArtworkImage[];
  video?: string;
  cloudinaryTag?: string;
  cloudinaryFolder?: string;
  imageOrder?: string;
  isPublished?: boolean;
  mainImageIndex?: number; // Index of featured image for gallery thumbnail
  mainImageUrl?: string;   // Actual URL of the chosen gallery thumbnail
  accent?: string;
}

// ==========================================
// PROJECT TYPES (for portfolio projects)
// ==========================================

export interface ProjectMeta {
  slug: string;
  folder: string;
  year: number;
  featured: boolean;
  accent: string;
  videoUrl?: string;
  image: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  award?: LocalizedText;
  description: LocalizedText;
  role?: LocalizedText;
  tools?: string[];
  externalUrl?: string;
  cloudinaryTag?: string;
  imageOrder?: string;
  isPublished?: boolean;
}

// ==========================================
// COMMISSION TYPES (for portfolio/commissions sub-works)
// ==========================================

export interface Commission {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  year?: number;
  accent?: string;
  image?: string;           // preview image URL (card thumbnail)
  cloudinaryTag?: string;   // tag whose images form the gallery
  imageOrder?: string;
  mainImageIndex?: number;  // which gallery image is the card preview
  isPublished?: boolean;
}