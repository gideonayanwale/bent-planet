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

    interface ExtractionResult {
      name?: string;
      eventType?: string;
      theme?: string;
      speaker?: string;
      hostName?: string;
      date?: string;
      endDate?: string;
      startTime?: string;
      caption?: string;
      whatsappContactNumber?: string;
      freeResourceName?: string;
    }

    interface ModelExtraction {
      modelName: string;
      data: ExtractionResult;
    }

    const candidateExtractions: ModelExtraction[] = [];

    // Helper to safely parse JSON from model output
    const extractJSON = (content: string): ExtractionResult | null => {
      try {
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
        if (parsed && typeof parsed === "object") {
          return parsed as ExtractionResult;
        }
        return null;
      } catch {
        return null;
      }
    };

    // Build array of concurrent collaborative model promises
    const visionTasks: Promise<void>[] = [];

    // 1. OpenRouter Vision Models (Run top 3 available vision models concurrently)
    if (openrouterKey) {
      const topOpenRouterModels = [
        "google/gemini-2.0-flash-exp:free",
        "qwen/qwen-2.5-vl-72b-instruct:free",
        "meta-llama/llama-3.2-11b-vision-instruct:free",
        "google/gemini-flash-1.5",
        "openai/gpt-4o-mini",
      ];

      for (const model of topOpenRouterModels) {
        visionTasks.push(
          (async () => {
            try {
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
                        { type: "image_url", image_url: { url: imageBase64 } },
                      ],
                    },
                  ],
                }),
              });

              if (res.ok) {
                const data = await res.json();
                const content = data?.choices?.[0]?.message?.content;
                if (content) {
                  const parsed = extractJSON(content);
                  if (parsed && (parsed.name || parsed.speaker || parsed.theme || parsed.date)) {
                    candidateExtractions.push({ modelName: `OpenRouter (${model})`, data: parsed });
                  }
                }
              }
            } catch (e) {
              console.warn(`[Collaborative Vision Engine] ${model} task failed:`, e);
            }
          })()
        );
      }
    }

    // 2. Direct Google Gemini Vision
    if (geminiKey) {
      visionTasks.push(
        (async () => {
          try {
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
                        { inlineData: { mimeType, data: base64Data } },
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
                const parsed = extractJSON(text);
                if (parsed && (parsed.name || parsed.speaker || parsed.theme || parsed.date)) {
                  candidateExtractions.push({ modelName: "Google Gemini 1.5 Flash Vision", data: parsed });
                }
              }
            }
          } catch (e) {
            console.warn("[Collaborative Vision Engine] Direct Gemini vision task failed:", e);
          }
        })()
      );
    }

    // 3. Direct OpenAI Vision
    if (openaiKey) {
      visionTasks.push(
        (async () => {
          try {
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
                const parsed = extractJSON(content);
                if (parsed && (parsed.name || parsed.speaker || parsed.theme || parsed.date)) {
                  candidateExtractions.push({ modelName: "OpenAI GPT-4o-mini Vision", data: parsed });
                }
              }
            }
          } catch (e) {
            console.warn("[Collaborative Vision Engine] Direct OpenAI vision task failed:", e);
          }
        })()
      );
    }

    // Wait for all collaborative models with a timeout promise
    await Promise.allSettled(visionTasks);

    if (candidateExtractions.length === 0) {
      throw new Error("Unable to extract event details. None of the collaborative vision models returned valid data.");
    }

    // Collaborative Consensus & Merge Algorithm:
    // Synthesizes the highest-confidence values across all responding models
    const mergedData: ExtractionResult = {};
    const participatingModels = candidateExtractions.map((c) => c.modelName);

    const keys: (keyof ExtractionResult)[] = [
      "name",
      "eventType",
      "theme",
      "speaker",
      "hostName",
      "date",
      "endDate",
      "startTime",
      "caption",
      "whatsappContactNumber",
      "freeResourceName",
    ];

    for (const key of keys) {
      const values = candidateExtractions
        .map((c) => c.data[key])
        .filter((v): v is string => typeof v === "string" && v.trim().length > 0 && v.trim() !== "TBA");

      if (values.length === 0) {
        mergedData[key] = "";
        continue;
      }

      // Count occurrences of each value
      const frequencyMap = new Map<string, number>();
      for (const val of values) {
        frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
      }

      // Find value with highest agreement / completeness
      let bestVal = values[0];
      let maxCount = 0;

      frequencyMap.forEach((count, val) => {
        if (count > maxCount || (count === maxCount && val.length > bestVal.length)) {
          maxCount = count;
          bestVal = val;
        }
      });

      // Format date validation
      if (key === "date" || key === "endDate") {
        const dateMatch = bestVal.match(/\d{4}-\d{2}-\d{2}/);
        if (dateMatch) {
          bestVal = dateMatch[0];
        }
      }

      mergedData[key] = bestVal;
    }

    return NextResponse.json({
      success: true,
      data: mergedData,
      participatingModels,
      collaborativeModelCount: candidateExtractions.length,
      providerUsed: `Ensemble of ${candidateExtractions.length} Vision Model(s): ${participatingModels.slice(0, 3).join(", ")}${
        participatingModels.length > 3 ? ` + ${participatingModels.length - 3} more` : ""
      }`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in collaborative flyer extraction API route:", err);
    return NextResponse.json(
      { error: err.message || "Failed to extract flyer details" },
      { status: 500 }
    );
  }
}
