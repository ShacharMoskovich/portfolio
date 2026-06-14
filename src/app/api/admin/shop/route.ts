import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getShopProducts, saveShopProducts } from '@/lib/blob-data';

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const products = await getShopProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const newProduct = await request.json();
    if (!newProduct.slug || !newProduct.title || !newProduct.description) {
      return NextResponse.json({ error: 'Missing required fields: slug, title, description' }, { status: 400 });
    }
    const products = await getShopProducts();
    if (products.some((p: any) => p.slug === newProduct.slug)) {
      return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 400 });
    }
    products.push(newProduct);
    await saveShopProducts(products);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
