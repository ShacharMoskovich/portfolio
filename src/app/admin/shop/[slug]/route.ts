import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getShopProducts, saveShopProducts } from '@/lib/blob-data';

export async function GET(_r: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params;
  const products = await getShopProducts();
  const product = products.find((p: any) => p.slug === slug);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { slug } = await params;
    const updated = await request.json();
    const products = await getShopProducts();
    const i = products.findIndex((p: any) => p.slug === slug);
    if (i === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    products[i] = { ...products[i], ...updated, slug };
    await saveShopProducts(products);
    return NextResponse.json({ success: true, product: products[i] });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_r: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params;
  const products = await getShopProducts();
  const i = products.findIndex((p: any) => p.slug === slug);
  if (i === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  const deleted = products.splice(i, 1)[0];
  await saveShopProducts(products);
  return NextResponse.json({ success: true, product: deleted });
}
