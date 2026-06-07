import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { put, get } from '@vercel/blob';
import { getArtworks, getCommissions } from '@/lib/blob-data';

// TEMPORARY debug endpoint — verifies blob round-trip + shows stored data.
// Delete after debugging.
export async function GET() {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const report: any = {};

  // 1) Round-trip test: write a value, read it back with useCache:false
  try {
    const testValue = JSON.stringify({ stamp: Date.now() });
    await put('data/_debug_roundtrip.json', testValue, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    const readBack = await get('data/_debug_roundtrip.json', { access: 'private', useCache: false });
    if (readBack && readBack.statusCode === 200) {
      const text = await new Response(readBack.stream).text();
      report.roundTrip = { ok: text === testValue, wrote: testValue, read: text };
    } else {
      report.roundTrip = { ok: false, reason: 'get returned null or non-200', statusCode: readBack?.statusCode ?? null };
    }
  } catch (e) {
    report.roundTrip = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  // 2) Current stored data
  const artworks = await getArtworks();
  const commissions = await getCommissions();
  report.artworks = artworks.map((a: any) => ({ slug: a.slug, mainImageUrl: a.mainImageUrl || null, isPublished: a.isPublished }));
  report.commissions = commissions.map((c: any) => ({ slug: c.slug, isPublished: c.isPublished, hasImage: !!c.image }));
  report.counts = { artworks: artworks.length, commissions: commissions.length };

  return NextResponse.json(report);
}