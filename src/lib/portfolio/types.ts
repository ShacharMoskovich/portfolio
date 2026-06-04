export type Locale = "en" | "he";

export type Bilingual = Record<Locale, string>;

export interface ProjectMeta {
  slug: string;
  folder: string;
  year: number;
  featured?: boolean;
  title: Bilingual;
  subtitle: Bilingual;
  description: Bilingual;
  tools: string[];
  role: Bilingual;
  award?: Bilingual;
  externalUrl?: string;
  videoUrl?: string;
  accent: string;
  image?: string; // Cloudinary URL for portfolio box
}

export interface MediaItem {
  publicId: string;
  resourceType: "image" | "video";
  format: string;
  width: number;
  height: number;
  captionEn?: string;
  captionHe?: string;
  alt?: string;
  order: number;
  bytes?: number;
  version?: number;
  isCover?: boolean;
}

export interface Artwork {
  slug: string;
  title: Bilingual;
  description: Bilingual;
  dimensions?: Bilingual;
  materials?: Bilingual;
  year: number;
  images: Array<{
    url: string;
    publicId: string;
    caption?: Bilingual;
  }>;
  video?: string;
  accent: string;
  cloudinaryTag?: string;
  imageOrder?: string;
  isPublished?: boolean;
}