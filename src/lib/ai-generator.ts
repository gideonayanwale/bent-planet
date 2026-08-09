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

/**
 * Multi-Provider Collaborative AI Generation Engine
 * Attempts generation using available API providers in sequence:
 * 1. OpenAI (gpt-4o / gpt-4o-mini)
 * 2. DeepSeek / OpenRouter (OpenAI-compatible)
 * 3. Google Gemini (REST endpoint using GEMINI_API_KEY)
 * 4. Anthropic Claude (REST endpoint using ANTHROPIC_API_KEY)
 * 5. Pre-built Rich Faith Variant (Guaranteed zero-fail fallback)
 */
export async function generateConferenceContentWithFallbacks(
  input: GenerateConferencePromptInput
): Promise<GeneratedConferenceOutput> {
  const { name, caption = "", theme = "Revival", speaker = "Guest Speaker", date = "", startTime = "", churchName = "Our Church" } = input;

  const prompt = `
You are an expert copywriter for Christian ministry conferences.
Please generate rich, engaging, Spirit-filled content for an upcoming conference.
Church Name: ${churchName}
Conference Name: ${name}
Theme: ${theme}
Speaker: ${speaker}
Date: ${date} at ${startTime}
Short Caption/Context: ${caption}

Please output strictly valid JSON matching this structure:
{
  "fullDescription": "A 300-500 word description written in a dynamic, Spirit-filled Christian tone.",
  "speakerBio": "A 2-3 paragraph biography for the speaker, tailored to the theme.",
  "agenda": [
    {"time": "18:00", "title": "Opening Worship & Intercession", "description": "Lifting high praise..."},
    {"time": "19:00", "title": "Keynote Ministration", "description": "Powerful message on revival..."}
  ],
  "socialCaptions": {
    "instagram": "Ready for transformation? Join us...",
    "whatsapp": "Greetings family! Don't miss...",
    "facebook": "We invite you to gather with us...",
    "twitter": "Expect signs & wonders! ..."
  },
  "ogTitle": "${name} | ${churchName}",
  "ogDescription": "Join us live for ${theme} with ${speaker}."
}
`;

  // 1. Try OpenAI if key is present
  if (process.env.OPENAI_API_KEY) {
    try {
      console.log("[AI Engine] Attempting OpenAI (gpt-4o)...");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.8,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return { ...parsed, providerUsed: "OpenAI gpt-4o" };
      }
    } catch (err) {
      console.warn("[AI Engine] OpenAI failed, falling back to next provider...", err);
    }
  }

  // 2. Try DeepSeek if key is present
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
        const parsed = JSON.parse(content);
        return { ...parsed, providerUsed: "DeepSeek API" };
      }
    } catch (err) {
      console.warn("[AI Engine] DeepSeek failed, trying next provider...", err);
    }
  }

  // 3. Try Google Gemini if key is present
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (geminiKey) {
    try {
      console.log("[AI Engine] Attempting Google Gemini API...");
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt + "\nReturn ONLY JSON." }] }],
        }),
      });

      if (res.ok) {
        const geminiData = await res.json();
        const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(jsonString);
          return { ...parsed, providerUsed: "Google Gemini" };
        }
      }
    } catch (err) {
      console.warn("[AI Engine] Gemini API failed, trying next provider...", err);
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
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt + "\nRespond with valid JSON only." }],
        }),
      });

      if (res.ok) {
        const claudeData = await res.json();
        const text = claudeData?.content?.[0]?.text;
        if (text) {
          const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(jsonString);
          return { ...parsed, providerUsed: "Anthropic Claude" };
        }
      }
    } catch (err) {
      console.warn("[AI Engine] Anthropic Claude failed, falling back...", err);
    }
  }

  // 5. Guaranteed Pre-built Fallback Engine (Zero Uptime Failures)
  console.log("[AI Engine] Serving rich prebuilt variant for theme:", theme);
  const fallback = getVariantContent(theme, name, churchName, speaker, date || "Upcoming Date");
  return { ...fallback, providerUsed: "Pre-built Faith Engine (Fallback)" };
}
