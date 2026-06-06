import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete("shachar_admin");
  return res;
}