import { NextResponse } from "next/server";
import { generateConferenceContentWithFallbacks } from "@/lib/ai-generator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, caption, theme, speaker, date, startTime, churchName } = body;

    if (!name) {
      return NextResponse.json({ error: "Conference name is required" }, { status: 400 });
    }

    const generatedContent = await generateConferenceContentWithFallbacks({
      name,
      caption,
      theme,
      speaker,
      date,
      startTime,
      churchName,
    });

    return NextResponse.json(generatedContent);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in AI conference generation API:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate conference content" },
      { status: 500 }
    );
  }
}
