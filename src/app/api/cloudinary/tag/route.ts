import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  if (!tag) {
    return Response.json({ error: 'Tag is required' }, { status: 400 });
  }

  try {
    const result = await cloudinary.api.resources_by_tag(tag, {
      max_results: 500,
    });

    const resources = (result.resources || []).map((resource: any) => ({
      url: resource.secure_url,
      publicId: resource.public_id,
    }));

    return Response.json({ resources });
  } catch (error) {
    console.error('Cloudinary API error:', error);
    return Response.json(
      { error: 'Failed to fetch images from Cloudinary' },
      { status: 500 }
    );
  }
}