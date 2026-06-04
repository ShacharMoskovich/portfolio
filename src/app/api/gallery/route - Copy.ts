import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    // Fetch all images from shachar-portfolio/gallery folder
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "shachar-portfolio/gallery",
      max_results: 500,
      resource_type: "image",
    });

    if (!result.resources) {
      return NextResponse.json({ images: [], success: true });
    }

    // Build URLs for each image with optimization
    const images = result.resources.map((resource: any) => ({
      url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_600,q_80/${resource.public_id}.${resource.format}`,
      publicId: resource.public_id,
      format: resource.format,
      width: resource.width,
      height: resource.height,
    }));

    return NextResponse.json({ images, success: true });
  } catch (error) {
    console.error("Cloudinary API error:", error);
    return NextResponse.json(
      { 
        images: [], 
        error: "Failed to fetch images from Cloudinary",
        success: false 
      },
      { status: 500 }
    );
  }
}