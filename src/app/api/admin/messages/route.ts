import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getMessages } from '@/lib/blob-data';

export async function GET() {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const messages = await getMessages();
  return NextResponse.json({ messages });
}
