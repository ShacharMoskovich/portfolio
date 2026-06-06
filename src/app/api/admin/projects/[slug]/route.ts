import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getProjects, saveProjects } from '@/lib/blob-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const projects = await getProjects();
    const project = projects.find((p: any) => p.slug === slug);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

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

    if (!updatedProject.title || !updatedProject.description) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description' },
        { status: 400 }
      );
    }

    const projects = await getProjects();
    const index = projects.findIndex((p: any) => p.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[index] = { ...projects[index], ...updatedProject, slug };
    await saveProjects(projects);

    return NextResponse.json({ success: true, project: projects[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const projects = await getProjects();
    const index = projects.findIndex((p: any) => p.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const deleted = projects.splice(index, 1)[0];
    await saveProjects(projects);

    return NextResponse.json({ success: true, project: deleted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
