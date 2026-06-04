import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if the admin cookie exists
    const cookie = request.cookies.get("shachar_admin");
    const isAdmin = !!cookie?.value;
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}
