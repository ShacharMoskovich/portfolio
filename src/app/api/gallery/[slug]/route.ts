import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    console.log(`Fetching by tag: ${slug}`);

    // Fetch by tag (images + videos)
    const result = await cloudinary.api.resources_by_tag(slug, {
      max_results: 500,
    });

    console.log(`Found ${result.resources?.length || 0} resources with tag "${slug}"`);

    const images = await Promise.all(
      (result.resources || []).map(async (resource: any) => {
        try {
          const fullResource = await cloudinary.api.resource(resource.public_id);
          const caption = fullResource.context?.custom?.alt || "";

          let url;
          if (resource.resource_type === "video") {
            url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,c_scale,w_800,q_80/${resource.public_id}.mp4`;
          } else {
            url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_800,q_80/${resource.public_id}.${resource.format}`;
          }

          return {
            url: url,
            publicId: resource.public_id,
            format: resource.format,
            width: resource.width,
            height: resource.height,
            caption: caption,
            resourceType: resource.resource_type,
          };
        } catch (err) {
          return null;
        }
      })
    );

    const validImages = images.filter((img) => img !== null);

    return NextResponse.json({ images: validImages, success: true });
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { images: [], error: "Failed to fetch images", success: false },
      { status: 500 }
    );
  }
}