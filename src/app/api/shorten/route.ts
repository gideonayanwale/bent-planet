import { NextResponse } from "next/server";
import { shortenUrl } from "@/lib/bitly";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid url parameter" }, { status: 400 });
    }

    const shortUrl = await shortenUrl(url);
    return NextResponse.json({ shortUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to shorten URL" }, { status: 500 });
  }
}
