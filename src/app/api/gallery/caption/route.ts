import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    console.log("\n=== SAVING CAPTION ===");
    
    const cookie = request.cookies.get("shachar_admin");
    if (!cookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { publicId, caption } = await request.json();
    console.log("Saving caption for:", publicId);
    console.log("Caption text:", caption);

    // Use context with a proper key-value pair
    const updateResult = await cloudinary.api.update(publicId, {
      context: { alt: caption }, // Store caption in 'alt' context field
    });
    
    console.log("Update result:", updateResult);
    console.log("SUCCESS - Caption saved");

    return NextResponse.json({ success: true, caption });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 }
    );
  }
}