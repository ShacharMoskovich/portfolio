import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getCommissions, saveCommissions } from '@/lib/blob-data';

export async function GET(_request: NextRequest) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const commissions = await getCommissions();
    return NextResponse.json({ commissions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read commissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const newCommission = await request.json();

    if (!newCommission.slug || !newCommission.title || !newCommission.description) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, description' },
        { status: 400 }
      );
    }

    const commissions = await getCommissions();

    if (commissions.some((c: any) => c.slug === newCommission.slug)) {
      return NextResponse.json(
        { error: 'Commission with this slug already exists' },
        { status: 400 }
      );
    }

    commissions.push(newCommission);
    await saveCommissions(commissions);

    return NextResponse.json({ success: true, commission: newCommission });
  } catch (error) {
    console.error('Error creating commission:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create commission';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
