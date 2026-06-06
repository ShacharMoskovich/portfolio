import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getProjects, saveProjects } from '@/lib/blob-data';

export async function GET(_request: NextRequest) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const projects = await getProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const newProject = await request.json();

    if (!newProject.slug || !newProject.title || !newProject.description) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, description' },
        { status: 400 }
      );
    }

    const projects = await getProjects();

    if (projects.some((p: any) => p.slug === newProject.slug)) {
      return NextResponse.json(
        { error: 'Project with this slug already exists' },
        { status: 400 }
      );
    }

    projects.push(newProject);
    await saveProjects(projects);

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
