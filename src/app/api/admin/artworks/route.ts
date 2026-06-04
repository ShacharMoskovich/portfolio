import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const ARTWORKS_PATH = join(process.cwd(), "public", "artworks.json");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newArtwork = body;

    // Validate required fields
    if (!newArtwork.slug || !newArtwork.title || !newArtwork.description) {
      return NextResponse.json(
        { error: "Missing required fields: slug, title, description" },
        { status: 400 }
      );
    }

    // Read existing artworks
    const fileContent = await readFile(ARTWORKS_PATH, "utf-8");
    const artworks = JSON.parse(fileContent);

    // Check if slug already exists
    if (artworks.some((a: any) => a.slug === newArtwork.slug)) {
      return NextResponse.json(
        { error: "Artwork with this slug already exists" },
        { status: 400 }
      );
    }

    // Add new artwork
    artworks.push(newArtwork);

    // Write back to file
    await writeFile(ARTWORKS_PATH, JSON.stringify(artworks, null, 2));

    return NextResponse.json({
      success: true,
      message: "Artwork created successfully",
      artwork: newArtwork,
    });
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json(
      { error: "Failed to create artwork" },
      { status: 500 }
    );
  }
}

// GET all artworks
export async function GET(_request: NextRequest) {
  try {
    const fileContent = await readFile(ARTWORKS_PATH, "utf-8");
    const artworks = JSON.parse(fileContent);
    return NextResponse.json({ artworks });
  } catch (error) {
    console.error("Error reading artworks:", error);
    return NextResponse.json(
      { error: "Failed to read artworks" },
      { status: 500 }
    );
  }
}