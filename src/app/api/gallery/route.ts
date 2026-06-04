import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    const result = await cloudinary.api.resources_by_tag("gallery", {
      max_results: 500,
      resource_type: "image",
    });

    const images = await Promise.all(
      (result.resources || []).map(async (resource: any) => {
        try {
          const fullResource = await cloudinary.api.resource(resource.public_id);
          
          // Read from context.custom.alt
          const caption = fullResource.context?.custom?.alt || "";
          
          console.log(`${resource.public_id} - caption:`, caption);

          return {
            url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_600,q_80/${resource.public_id}.${resource.format}`,
            publicId: resource.public_id,
            format: resource.format,
            width: resource.width,
            height: resource.height,
            caption: caption,
          };
        } catch (err) {
          return {
            url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_600,q_80/${resource.public_id}.${resource.format}`,
            publicId: resource.public_id,
            format: resource.format,
            width: resource.width,
            height: resource.height,
            caption: "",
          };
        }
      })
    );

    return NextResponse.json({ images, success: true });
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { images: [], error: "Failed to fetch", success: false },
      { status: 500 }
    );
  }
}