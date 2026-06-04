export type Locale = "en" | "he";

export interface LocalizedText {
  en: string;
  he: string;
}

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
  mainImageIndex?: number; // NEW: Index of the main/featured image
  accent?: string;
}

export interface ProjectMeta {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  subtitle?: LocalizedText;  // ← Add this
  accent: string;
  images?: ArtworkImage[];
  cloudinaryTag?: string;
  isPublished?: boolean;
}