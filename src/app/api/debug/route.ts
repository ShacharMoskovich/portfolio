import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getArtworks, getCommissions } from '@/lib/blob-data';

// TEMPORARY debug endpoint — shows what is actually stored in Blob.
// Delete after debugging.
export async function GET() {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const artworks = await getArtworks();
  const commissions = await getCommissions();

  return NextResponse.json({
    artworks: artworks.map((a: any) => ({
      slug: a.slug,
      mainImageIndex: a.mainImageIndex,
      mainImageUrl: a.mainImageUrl || null,
      isPublished: a.isPublished,
    })),
    commissions: commissions.map((c: any) => ({
      slug: c.slug,
      titleEn: c.title?.en,
      isPublished: c.isPublished,
      isPublishedType: typeof c.isPublished,
      hasImage: !!c.image,
      cloudinaryTag: c.cloudinaryTag || null,
    })),
    counts: { artworks: artworks.length, commissions: commissions.length },
  });
}
