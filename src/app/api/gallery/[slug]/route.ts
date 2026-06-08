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

    // Fetch BOTH images and videos that carry this tag.
    // resources_by_tag defaults to resource_type:'image', so we must query
    // videos separately and merge.
    const [imageRes, videoRes] = await Promise.all([
      cloudinary.api
        .resources_by_tag(slug, { max_results: 500, resource_type: "image" })
        .catch(() => ({ resources: [] })),
      cloudinary.api
        .resources_by_tag(slug, { max_results: 500, resource_type: "video" })
        .catch(() => ({ resources: [] })),
    ]);

    const allResources = [
      ...(imageRes.resources || []),
      ...(videoRes.resources || []),
    ];

    const items = await Promise.all(
      allResources.map(async (resource: any) => {
        try {
          const fullResource = await cloudinary.api.resource(resource.public_id, {
            resource_type: resource.resource_type,
          });
          const caption = fullResource.context?.custom?.alt || "";

          let url;
          if (resource.resource_type === "video") {
            url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,c_scale,w_800,q_80/${resource.public_id}.mp4`;
          } else {
            url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_800,q_80/${resource.public_id}.${resource.format}`;
          }

          return {
            url,
            publicId: resource.public_id,
            format: resource.format,
            width: resource.width,
            height: resource.height,
            caption,
            resourceType: resource.resource_type, // 'image' | 'video'
            createdAt: resource.created_at,
          };
        } catch {
          return null;
        }
      })
    );

    const validItems = items.filter((i) => i !== null);

    return NextResponse.json({ images: validItems, success: true });
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { images: [], error: "Failed to fetch images", success: false },
      { status: 500 }
    );
  }
}
