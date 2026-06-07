import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getCommissions, saveCommissions } from '@/lib/blob-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const commissions = await getCommissions();
    const commission = commissions.find((c: any) => c.slug === slug);
    if (!commission) {
      return NextResponse.json({ error: 'Commission not found' }, { status: 404 });
    }
    return NextResponse.json(commission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch commission' }, { status: 500 });
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

    const commissions = await getCommissions();
    const index = commissions.findIndex((c: any) => c.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: 'Commission not found' }, { status: 404 });
    }

    commissions[index] = { ...commissions[index], ...updatedData, slug };
    await saveCommissions(commissions);

    return NextResponse.json({ success: true, commission: commissions[index] });
  } catch (error) {
    console.error('Commission update error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update commission';
    return NextResponse.json({ error: msg }, { status: 500 });
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
    const commissions = await getCommissions();
    const index = commissions.findIndex((c: any) => c.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: 'Commission not found' }, { status: 404 });
    }

    const deleted = commissions.splice(index, 1)[0];
    await saveCommissions(commissions);

    return NextResponse.json({ success: true, commission: deleted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete commission' }, { status: 500 });
  }
}
