import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getArtworks, saveArtworks } from '@/lib/blob-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const artworks = await getArtworks();
    const artwork = artworks.find((a: any) => a.slug === slug);
    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }
    return NextResponse.json({ artwork });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch artwork' }, { status: 500 });
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
    const updatedData = await request.json();

    const artworks = await getArtworks();
    const index = artworks.findIndex((a: any) => a.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    artworks[index] = { ...artworks[index], ...updatedData, slug };
    await saveArtworks(artworks);

    return NextResponse.json({ success: true, artwork: artworks[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 });
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
    const artworks = await getArtworks();
    const index = artworks.findIndex((a: any) => a.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const deleted = artworks.splice(index, 1)[0];
    await saveArtworks(artworks);

    return NextResponse.json({ success: true, artwork: deleted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete artwork' }, { status: 500 });
  }
}
