import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getArtworks, saveArtworks } from '@/lib/blob-data';

export async function GET(_request: NextRequest) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const artworks = await getArtworks();
    return NextResponse.json({ artworks });
  } catch (error) {
    console.error('Error reading artworks:', error);
    return NextResponse.json({ error: 'Failed to read artworks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const newArtwork = await request.json();

    if (!newArtwork.slug || !newArtwork.title || !newArtwork.description) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, description' },
        { status: 400 }
      );
    }

    const artworks = await getArtworks();

    if (artworks.some((a: any) => a.slug === newArtwork.slug)) {
      return NextResponse.json(
        { error: 'Artwork with this slug already exists' },
        { status: 400 }
      );
    }

    artworks.push(newArtwork);
    await saveArtworks(artworks);

    return NextResponse.json({ success: true, artwork: newArtwork });
  } catch (error) {
    console.error('Error creating artwork:', error);
    return NextResponse.json({ error: 'Failed to create artwork' }, { status: 500 });
  }
}
