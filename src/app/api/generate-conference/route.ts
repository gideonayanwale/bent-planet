import { NextResponse } from "next/server";
import { generateConferenceContentWithFallbacks } from "@/lib/ai-generator";
import { getCurrentUser } from "@/lib/auth";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, caption, theme, speaker, date, startTime } = body;
    let churchName = body.churchName;

    if (!name) {
      return NextResponse.json({ error: "Conference name is required" }, { status: 400 });
    }

    if (!churchName) {
      try {
        const user = await getCurrentUser();
        if (user?.email) {
          const adminClient = createAdminClient();
          const church = await getChurchByAdminEmail(adminClient, user.email);
          if (church?.name) {
            churchName = church.name;
          }
        }
      } catch {
        // Fallback to default
      }
    }

    const generatedContent = await generateConferenceContentWithFallbacks({
      name,
      caption,
      theme,
      speaker,
      date,
      startTime,
      churchName: churchName || "Our Church",
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
