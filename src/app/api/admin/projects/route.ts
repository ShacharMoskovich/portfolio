import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const PROJECTS_PATH = join(process.cwd(), "public", "projects.json");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProject = body;

    // Validate required fields
    if (!newProject.slug || !newProject.title || !newProject.description) {
      return NextResponse.json(
        { error: "Missing required fields: slug, title, description" },
        { status: 400 }
      );
    }

    // Read existing projects
    const fileContent = await readFile(PROJECTS_PATH, "utf-8");
    const projects = JSON.parse(fileContent);

    // Check if slug already exists
    if (projects.some((p: any) => p.slug === newProject.slug)) {
      return NextResponse.json(
        { error: "Project with this slug already exists" },
        { status: 400 }
      );
    }

    // Add new project
    projects.push(newProject);

    // Write back to file
    await writeFile(PROJECTS_PATH, JSON.stringify(projects, null, 2));

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// GET all projects (optional, for admin dashboard)
export async function GET(_request: NextRequest) {
  try {
    const fileContent = await readFile(PROJECTS_PATH, "utf-8");
    const projects = JSON.parse(fileContent);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error reading projects:", error);
    return NextResponse.json(
      { error: "Failed to read projects" },
      { status: 500 }
    );
  }
}