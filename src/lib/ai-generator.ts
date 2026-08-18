import OpenAI from "openai";
import { getVariantContent } from "@/lib/prebuilt-variants";

export interface GenerateConferencePromptInput {
  name: string;
  caption?: string;
  theme?: string;
  speaker?: string;
  date?: string;
  startTime?: string;
  churchName?: string;
}

export interface GeneratedConferenceOutput {
  fullDescription: string;
  speakerBio: string;
  agenda: { time: string; title: string; description: string }[];
  socialCaptions?: Record<string, string>;
  ogTitle?: string;
  ogDescription?: string;
  providerUsed?: string;
}

function cleanAndParseJSON(rawText: string): GeneratedConferenceOutput | null {
  try {
    let text = rawText.trim();
    // Remove markdown code fences if present
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    }
    
    // Find json object bounds if wrapped by surrounding text
    const firstOpen = text.indexOf("{");
    const lastClose = text.lastIndexOf("}");
    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
      text = text.substring(firstOpen, lastClose + 1);
    }

    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && parsed.fullDescription) {
      return parsed as GeneratedConferenceOutput;
    }
    return null;
  } catch (e) {
    console.warn("[AI Engine] Failed to parse generated JSON:", e);
    return null;
  }
}

/**
 * Multi-Provider Collaborative AI Generation Engine
 * Attempts generation using available API providers in sequence:
 * 1. OpenAI (gpt-4o / gpt-4o-mini)
 * 2. Google Gemini (gemini-1.5-flash / gemini-2.0-flash via GEMINI_API_KEY)
 * 3. DeepSeek (deepseek-chat)
 * 4. Anthropic Claude (claude-3-5-sonnet)
 * 5. Pre-built Rich Faith Variant (Guaranteed zero-fail fallback)
 */
export async function generateConferenceContentWithFallbacks(
  input: GenerateConferencePromptInput
): Promise<GeneratedConferenceOutput> {
  const {
    name,
    caption = "",
    theme = "Revival & Healing",
    speaker = "Guest Minister",
    date = "",
    startTime = "",
    churchName = "Our Church",
  } = input;

  const prompt = `
You are an expert copywriter for Christian ministry conferences and church events.
Please generate rich, inspiring, Spirit-filled content for this upcoming conference.
Church Name: ${churchName}
Conference Name: ${name}
Theme: ${theme}
Speaker/Minister: ${speaker}
Date & Time: ${date} ${startTime ? `at ${startTime}` : ""}
Context/Scripture notes: ${caption}

Please output strictly valid JSON matching this schema:
{
  "fullDescription": "A 300-500 word description written in a warm, dynamic, Spirit-filled Christian tone.",
  "speakerBio": "A 2-3 paragraph biography for the speaker, tailored to the conference theme and spiritual mandate.",
  "agenda": [
    {"time": "09:00 AM", "title": "Opening Worship & Consecration", "description": "Atmospheric worship and laying the spiritual foundation..."},
    {"time": "10:30 AM", "title": "Keynote Ministration", "description": "Powerful teaching and impartation on ${theme}..."},
    {"time": "01:00 PM", "title": "Prophetic Prayer & Altar Call", "description": "Targeted intercession and personal breakthrough..."}
  ],
  "socialCaptions": {
    "instagram": "Ready for a divine encounter? Join us for ${name}...",
    "whatsapp": "🙌 *${name.toUpperCase()}* 🙌\\n\\nJoin ${churchName} with ${speaker} on ${date}...",
    "whatsappChannel": "📢 *CHANNEL UPDATE: ${name.toUpperCase()}*\\n\\nJoin ${churchName} with minister ${speaker} on ${date}... Tap below to save your spot:",
    "facebook": "We warmly invite you to join us for ${name}...",
    "twitter": "Expect signs & wonders! ${name} is coming on ${date}..."
  },
  "ogTitle": "${name} | ${churchName}",
  "ogDescription": "Join ${churchName} with ${speaker} for an inspiring conference on ${date}."
}
`;

  // 1. Try OpenAI if key is present
  if (process.env.OPENAI_API_KEY) {
    try {
      console.log("[AI Engine] Attempting OpenAI (gpt-4o)...");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a Christian copywriter. Always output valid JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = cleanAndParseJSON(content);
        if (parsed) {
          return { ...parsed, providerUsed: "OpenAI gpt-4o" };
        }
      }
    } catch (err) {
      console.warn("[AI Engine] OpenAI failed, trying next provider...", err);
    }
  }

  // 2. Try Google Gemini if key is present
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (geminiKey) {
    try {
      console.log("[AI Engine] Attempting Google Gemini API...");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt + "\nRespond with STRICTLY JSON." }] }],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (res.ok) {
        const geminiData = await res.json();
        const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = cleanAndParseJSON(text);
          if (parsed) {
            return { ...parsed, providerUsed: "Google Gemini" };
          }
        }
      }
    } catch (err) {
      console.warn("[AI Engine] Gemini API failed, trying next provider...", err);
    }
  }

  // 3. Try DeepSeek if key is present
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      console.log("[AI Engine] Attempting DeepSeek (deepseek-chat)...");
      const deepseek = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: "https://api.deepseek.com",
      });
      const completion = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = cleanAndParseJSON(content);
        if (parsed) {
          return { ...parsed, providerUsed: "DeepSeek API" };
        }
      }
    } catch (err) {
      console.warn("[AI Engine] DeepSeek failed, trying next provider...", err);
    }
  }

  // 4. Try Anthropic Claude if key is present
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      console.log("[AI Engine] Attempting Anthropic Claude API...");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2500,
          messages: [{ role: "user", content: prompt + "\nRespond with valid JSON only." }],
        }),
      });

      if (res.ok) {
        const claudeData = await res.json();
        const text = claudeData?.content?.[0]?.text;
        if (text) {
          const parsed = cleanAndParseJSON(text);
          if (parsed) {
            return { ...parsed, providerUsed: "Anthropic Claude" };
          }
        }
      }
    } catch (err) {
      console.warn("[AI Engine] Anthropic Claude failed, trying next provider...", err);
    }
  }

  // 5. Try Free OpenRouter Models if OPENROUTER_API_KEY is present
  if (process.env.OPENROUTER_API_KEY) {
    const freeModels = [
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "deepseek/deepseek-r1:free",
      "qwen/qwen-2.5-coder-32b-instruct:free",
      "openrouter/auto",
    ];

    for (const freeModel of freeModels) {
      try {
        console.log(`[AI Engine] Attempting OpenRouter free model (${freeModel})...`);
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://bentplanet.com",
            "X-Title": "Bent Planet",
          },
          body: JSON.stringify({
            model: freeModel,
            messages: [
              { role: "system", content: "You are a Christian copywriter. Output strictly valid JSON." },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (res.ok) {
          const routerData = await res.json();
          const content = routerData?.choices?.[0]?.message?.content;
          if (content) {
            const parsed = cleanAndParseJSON(content);
            if (parsed) {
              return { ...parsed, providerUsed: `OpenRouter Free (${freeModel})` };
            }
          }
        }
      } catch (err) {
        console.warn(`[AI Engine] OpenRouter model ${freeModel} failed, trying next...`, err);
      }
    }
  }

  // 6. Guaranteed Pre-built Faith Fallback Engine (Zero Uptime Failures)
  console.log("[AI Engine] Serving rich pre-built variant for theme:", theme);
  const fallback = getVariantContent(theme, name, churchName, speaker, date || "Upcoming Date");
  return { ...fallback, providerUsed: "Pre-built Faith Engine (Guaranteed Fallback)" };
}
