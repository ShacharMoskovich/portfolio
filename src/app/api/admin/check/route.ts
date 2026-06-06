import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if the admin cookie exists
    const cookie = request.cookies.get("shachar_admin");
    const isAdmin = !!cookie?.value;
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}
