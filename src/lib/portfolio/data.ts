import type { ProjectMeta } from "./types";
import projectsData from "../../../public/projects.json";

export const CLOUDINARY_ROOT = "shachar-portfolio";

export const projects: ProjectMeta[] = projectsData;

export function getProject(slug: string): ProjectMeta | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
