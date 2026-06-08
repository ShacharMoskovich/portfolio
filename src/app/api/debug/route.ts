import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getArtworks, getCommissions, saveCommissions } from '@/lib/blob-data';

// TEMPORARY debug. Delete after confirming Redis works.
export async function GET() {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const report: any = {};

  report.env = {
    hasKvUrl: !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL),
    hasKvToken: !!(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN),
  };

  const artworks = await getArtworks();
  report.artworksRead = artworks.map((a: any) => ({ slug: a.slug, mainImageUrl: a.mainImageUrl ?? '(none)' }));

  // Real write->read test (Redis is strongly consistent)
  try {
    const before = await getCommissions();
    const testItem: any = { slug: '_debug_test', title: { en: 'T', he: 'T' }, description: { en: 'd', he: 'd' }, isPublished: true };
    await saveCommissions([...before, testItem]);
    const after = await getCommissions();
    report.writeTest = {
      beforeCount: before.length,
      afterCount: after.length,
      persisted: after.some((c: any) => c.slug === '_debug_test'),
    };
    await saveCommissions(before); // restore
  } catch (e) {
    report.writeTest = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json(report);
}