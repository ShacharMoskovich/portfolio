import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ARTWORKS_FILE = path.join(process.cwd(), "public", "artworks.json");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const fileContent = fs.readFileSync(ARTWORKS_FILE, "utf-8");
    const artworks = JSON.parse(fileContent);

    const artwork = artworks.find((a: any) => a.slug === slug);

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json({ artwork });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch artwork" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const updatedData = await request.json();

    const fileContent = fs.readFileSync(ARTWORKS_FILE, "utf-8");
    let artworks = JSON.parse(fileContent);

    const index = artworks.findIndex((a: any) => a.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    artworks[index] = { ...artworks[index], ...updatedData };
    fs.writeFileSync(ARTWORKS_FILE, JSON.stringify(artworks, null, 2));

    return NextResponse.json({ success: true, artwork: artworks[index] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to update artwork" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const fileContent = fs.readFileSync(ARTWORKS_FILE, "utf-8");
    let artworks = JSON.parse(fileContent);

    const index = artworks.findIndex((a: any) => a.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    const deletedArtwork = artworks[index];
    artworks.splice(index, 1);

    fs.writeFileSync(ARTWORKS_FILE, JSON.stringify(artworks, null, 2));

    return NextResponse.json({ success: true, artwork: deletedArtwork });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to delete artwork" }, { status: 500 });
  }
}