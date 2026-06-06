import type { ProjectMeta, Artwork } from "./types";
import projectsData from "../../../public/projects.json";
import artworksData from "../../../public/artworks.json";

export const CLOUDINARY_ROOT = "shachar-portfolio";

// ---- Projects ----
export const projects: ProjectMeta[] = projectsData as ProjectMeta[];

export function getProject(slug: string): ProjectMeta | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

// ---- Artworks ----
export const artworks: Artwork[] = artworksData as Artwork[];

export function getArtwork(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}

export function getPublishedArtworks(): Artwork[] {
  return artworks.filter((a) => a.isPublished === true);
}

export function getPublishedProjects(): ProjectMeta[] {
  return projects.filter((p) => p.isPublished === true);
}
