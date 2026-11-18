import { NextResponse } from "next/server";
import { z } from "zod";
import { generateConferenceContentWithFallbacks } from "@/lib/ai-generator";
import { getCurrentUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { isSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const inputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  caption: z.string().trim().max(1000).optional(),
  theme: z.string().trim().max(200).optional(),
  speaker: z.string().trim().max(160).optional(),
  date: z.string().trim().max(40).optional(),
  startTime: z.string().trim().max(40).optional(),
});

const hourlyRequests = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 12;

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.email || isSuperAdmin(user.email)) {
      return NextResponse.json({ error: "A church administrator session is required." }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const church = await getChurchByAdminEmail(adminClient, user.email);
    if (!church || church.status === "suspended") {
      return NextResponse.json({ error: "An active church workspace is required." }, { status: 403 });
    }

    const now = Date.now();
    const current = hourlyRequests.get(church.id);
    if (!current || current.resetAt <= now) {
      hourlyRequests.set(church.id, { count: 1, resetAt: now + 60 * 60 * 1000 });
    } else if (current.count >= MAX_REQUESTS_PER_HOUR) {
      return NextResponse.json({ error: "Hourly AI generation limit reached. Please try again later." }, { status: 429 });
    } else {
      current.count += 1;
    }

    const parsed = inputSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a valid event name and event details." }, { status: 400 });
    }

    const generatedContent = await generateConferenceContentWithFallbacks({
      ...parsed.data,
      churchName: church.name,
    });

    return NextResponse.json(generatedContent);
  } catch (error: unknown) {
    console.error("AI conference generation error:", error);
    return NextResponse.json({ error: "Failed to generate conference content." }, { status: 500 });
  }
}
