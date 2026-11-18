import { NextResponse } from "next/server";
import { z } from "zod";
import { shortenUrl } from "@/lib/bitly";

const schema = z.object({
  url: z.string().trim().url().max(2048),
});

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 8 * 1024) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "A valid HTTP or HTTPS URL is required." }, { status: 400 });
    }

    const url = new URL(parsed.data.url);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return NextResponse.json({ error: "Only HTTP and HTTPS links can be shortened." }, { status: 400 });
    }

    const shortUrl = await shortenUrl(url.toString());
    return NextResponse.json({ shortUrl });
  } catch {
    return NextResponse.json({ error: "Failed to shorten URL." }, { status: 400 });
  }
}
