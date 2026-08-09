import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getVariantContent } from "@/lib/prebuilt-variants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, caption, theme, speaker, date, startTime, churchName, forcePrebuilt } = body;

    const fallbackContent = getVariantContent(
      theme || "Revival",
      name || "Annual Faith Gathering",
      churchName || "Our Church",
      speaker || "Guest Speaker",
      date || "Upcoming Date"
    );

    if (forcePrebuilt || !process.env.OPENAI_API_KEY) {
      console.log("Using prebuilt conference variant for theme:", theme);
      return NextResponse.json(fallbackContent);
    }

    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const prompt = `
You are an expert copywriter for Christian conferences.
Please generate rich, engaging content for an upcoming conference.
Church Name: ${churchName || "Our Church"}
Conference Name: ${name}
Theme: ${theme}
Speaker: ${speaker}
Date: ${date} at ${startTime}
Short Caption/Context: ${caption}

Please provide the output in strict JSON format with the following keys:
- "fullDescription": A compelling 300-500 word description of the event. Write in a dynamic, Spirit-filled, warm Christian tone.
- "agenda": An array of objects, each with "time" and "title" and "description" (e.g., {"time": "18:00", "title": "Opening Prayer & Worship", "description": "..."})
- "speakerBio": A 2-3 paragraph biography for the speaker, tailored to the theme.
- "socialCaptions": An object containing keys for "instagram", "whatsapp", "twitter", "facebook", and "youtube", each providing a ready-to-post caption with relevant emojis and hashtags.
- "ogTitle": A short, punchy title for open graph tags.
- "ogDescription": A short, 1-2 sentence description for open graph tags.
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.8,
      });

      const responseText = completion.choices[0].message.content;
      if (responseText) {
        const result = JSON.parse(responseText);
        return NextResponse.json(result);
      }
    } catch (openAiError) {
      console.warn("OpenAI API call failed, falling back to prebuilt variant:", openAiError);
      return NextResponse.json(fallbackContent);
    }

    return NextResponse.json(fallbackContent);
  } catch (error: any) {
    console.error("Error generating conference:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
