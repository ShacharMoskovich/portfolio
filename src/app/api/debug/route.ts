import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import {
  getArtworks, getCommissions, saveCommissions,
} from '@/lib/blob-data';

// TEMPORARY comprehensive debug. Delete after.
export async function GET() {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const report: any = { steps: [] };

  // A) Do the blob keys actually EXIST? (distinguishes empty-blob from fallback)
  for (const key of ['data/artworks.json', 'data/commissions.json']) {
    try {
      const r = await get(key, { access: 'private', useCache: false });
      report.steps.push({ key, exists: !!r, statusCode: r?.statusCode ?? null });
    } catch (e) {
      report.steps.push({ key, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // B) Current artworks — show mainImageUrl exactly as read
  const artworks = await getArtworks();
  report.artworksRead = artworks.map((a: any) => ({ slug: a.slug, mainImageUrl: a.mainImageUrl ?? '(none)' }));

  // C) REAL write->read test on the commissions key
  try {
    const before = await getCommissions();
    const testItem: any = { slug: '_debug_test', title: { en: 'T', he: 'T' }, description: { en: 'd', he: 'd' }, isPublished: true };
    await saveCommissions([...before, testItem]);
    const after = await getCommissions();
    const found = after.find((c: any) => c.slug === '_debug_test');
    report.commissionWriteTest = {
      beforeCount: before.length,
      afterCount: after.length,
      testItemPersisted: !!found,
    };
    // restore
    await saveCommissions(before);
    const restored = await getCommissions();
    report.commissionWriteTest.restoredCount = restored.length;
  } catch (e) {
    report.commissionWriteTest = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json(report);
}