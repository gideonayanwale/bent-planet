import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openrouterKey && !geminiKey && !openaiKey) {
      return NextResponse.json(
        { error: "No AI vision provider configured. Please set OPENROUTER_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const prompt = `You are an expert AI assistant that analyzes church, ministry, and Christian event flyers with extreme precision.
Examine this event flyer banner image and extract all relevant details.

Return ONLY a strictly valid JSON object matching this schema without any markdown formatting or surrounding commentary:
{
  "name": "Title or Name of the conference/event (string)",
  "eventType": "One of: Conference, Revival & Healing Meeting, Youth & Campus Summit, Women's Conference, Men's Conference, Retreat & Campmeeting, Monthly Miracle Service, Weekly Service Broadcast, Special Workshop / Seminar",
  "theme": "The main spiritual theme or scripture focus (e.g. Revival & Healing, Prophetic & Prayer, Faith & Breakthrough, Worship & Praise, etc.)",
  "speaker": "Name of the featured minister(s), speaker(s), or guest preacher(s) (string)",
  "hostName": "Name of host pastor, church bishop, or organizing minister if mentioned (string)",
  "date": "Start date in standard YYYY-MM-DD format if clear (e.g. 2026-09-15), or empty string if year/date ambiguous",
  "endDate": "End date in YYYY-MM-DD format if it is a multi-day convention, or empty string",
  "startTime": "Daily start time, e.g. '18:00', '09:00', or '6:00 PM' (string)",
  "caption": "A concise, powerful 1-2 sentence summary, scripture focus, or subtitle on the flyer (string)",
  "whatsappContactNumber": "RSVP or enquiry phone number if found on flyer (string)",
  "freeResourceName": "Study guide, devotional book, or free gift mentioned on flyer, or empty string"
}

Rules:
1. If any field is not present or visible on the flyer, return an empty string "" for that field.
2. Ensure dates use valid YYYY-MM-DD format if identifiable.
3. Return ONLY the JSON object.`;

    let extractedData: Record<string, any> | null = null;
    let providerUsed = "";

    // 1. Delegate across OpenRouter collaborative vision models
    if (openrouterKey) {
      const openrouterVisionModels = [
        "google/gemini-2.0-flash-exp:free",
        "meta-llama/llama-3.2-11b-vision-instruct:free",
        "qwen/qwen-2.5-vl-72b-instruct:free",
        "google/gemini-flash-1.5",
        "openai/gpt-4o-mini",
        "openrouter/auto",
      ];

      for (const model of openrouterVisionModels) {
        try {
          console.log(`[Flyer Vision Engine] Delegating to OpenRouter model: ${model}...`);
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openrouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://bentplanet.com",
              "X-Title": "Bent Planet Church Platform",
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: prompt },
                    {
                      type: "image_url",
                      image_url: { url: imageBase64 },
                    },
                  ],
                },
              ],
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            console.warn(`[Flyer Vision Engine] OpenRouter ${model} error (${res.status}):`, errText);
            continue;
          }

          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content;
          if (!content) continue;

          let cleanText = content.trim();
          if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
          }
          const firstBrace = cleanText.indexOf("{");
          const lastBrace = cleanText.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1) {
            cleanText = cleanText.substring(firstBrace, lastBrace + 1);
          }

          const parsed = JSON.parse(cleanText);
          if (parsed && typeof parsed === "object" && (parsed.name || parsed.speaker || parsed.theme)) {
            extractedData = parsed;
            providerUsed = `OpenRouter (${model})`;
            break;
          }
        } catch (modelErr) {
          console.warn(`[Flyer Vision Engine] OpenRouter ${model} failed:`, modelErr);
        }
      }
    }

    // 2. Fallback to Google Gemini Vision API if needed
    if (!extractedData && geminiKey) {
      try {
        console.log("[Flyer Vision Engine] Delegating to Google Gemini 1.5 Flash Vision...");
        const base64Data = imageBase64.includes("base64,") ? imageBase64.split("base64,")[1] : imageBase64;
        const mimeType = imageBase64.startsWith("data:") ? imageBase64.split(";")[0].replace("data:", "") : "image/jpeg";

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt + "\nStrictly valid JSON only." },
                    {
                      inlineData: {
                        mimeType,
                        data: base64Data,
                      },
                    },
                  ],
                },
              ],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );

        if (res.ok) {
          const gData = await res.json();
          const text = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            if (parsed && typeof parsed === "object") {
              extractedData = parsed;
              providerUsed = "Google Gemini Vision (1.5 Flash)";
            }
          }
        }
      } catch (geminiErr) {
        console.warn("[Flyer Vision Engine] Direct Gemini Vision fallback failed:", geminiErr);
      }
    }

    // 3. Fallback to OpenAI Vision (gpt-4o-mini / gpt-4o) if needed
    if (!extractedData && openaiKey) {
      try {
        console.log("[Flyer Vision Engine] Delegating to OpenAI Vision (gpt-4o-mini)...");
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: imageBase64 } },
                ],
              },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (res.ok) {
          const oData = await res.json();
          const content = oData?.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (parsed && typeof parsed === "object") {
              extractedData = parsed;
              providerUsed = "OpenAI Vision (gpt-4o-mini)";
            }
          }
        }
      } catch (openaiErr) {
        console.warn("[Flyer Vision Engine] Direct OpenAI Vision fallback failed:", openaiErr);
      }
    }

    if (!extractedData) {
      throw new Error("Unable to extract event details. Please verify your image and try again.");
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      providerUsed,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in flyer extraction API route:", err);
    return NextResponse.json(
      { error: err.message || "Failed to extract flyer details" },
      { status: 500 }
    );
  }
}
