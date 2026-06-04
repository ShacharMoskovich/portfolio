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
  mainImageIndex?: number;
  accent?: string;
}

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