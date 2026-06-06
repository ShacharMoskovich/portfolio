import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const PROJECTS_PATH = join(process.cwd(), "public", "projects.json");

// GET a single project by slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug } = await params;

    const fileContent = await readFile(PROJECTS_PATH, "utf-8");
    const projects = JSON.parse(fileContent);

    const project = projects.find((p: any) => p.slug === slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PUT (Update) a single project by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const updatedProject = await request.json();

    // Validate required fields
    if (!updatedProject.title || !updatedProject.description) {
      return NextResponse.json(
        { error: "Missing required fields: title, description" },
        { status: 400 }
      );
    }

    // Read existing projects
    const fileContent = await readFile(PROJECTS_PATH, "utf-8");
    const projects = JSON.parse(fileContent);

    // Find project index
    const projectIndex = projects.findIndex((p: any) => p.slug === slug);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Update project (preserve slug, update everything else)
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updatedProject,
      slug: slug, // Ensure slug doesn't change
    };

    // Write back to file
    await writeFile(PROJECTS_PATH, JSON.stringify(projects, null, 2));

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      project: projects[projectIndex],
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE a single project by slug
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug } = await params;

    const fileContent = await readFile(PROJECTS_PATH, "utf-8");
    const projects = JSON.parse(fileContent);

    const projectIndex = projects.findIndex((p: any) => p.slug === slug);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const deletedProject = projects[projectIndex];
    projects.splice(projectIndex, 1);

    await writeFile(PROJECTS_PATH, JSON.stringify(projects, null, 2));

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}