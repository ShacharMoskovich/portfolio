import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get("tag");

    if (!tag) {
      return NextResponse.json({ error: "Tag required" }, { status: 400 });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.api.resources_by_tag(tag, { max_results: 500 }, (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    const resources = result as any;
    const images = (resources.resources || [])
      .filter((r: any) => r.resource_type === 'image')
      .map((r: any) => ({
        url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_800,q_80/${r.public_id}`,
        publicId: r.public_id,
      }));

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}