import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateBroadcastEmailContentWithFallbacks } from "@/lib/ai-generator";

export const dynamic = "force-dynamic";

// In-memory sliding rate limit tracker per church ID: Map<churchId, { count: number, resetAt: number }>
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 15; // Generous free limit per hour

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const church = await getChurchByAdminEmail(adminClient, user.email);
    if (!church) {
      return NextResponse.json({ error: "Church workspace not found." }, { status: 404 });
    }

    // Check hourly rate limit for free tier
    const isPremium = church.is_premium || false;
    const now = Date.now();
    const churchKey = church.id;

    if (!isPremium) {
      const userRate = rateLimitMap.get(churchKey);
      if (userRate) {
        if (now < userRate.resetAt) {
          if (userRate.count >= MAX_REQUESTS_PER_HOUR) {
            const minutesLeft = Math.ceil((userRate.resetAt - now) / 60000);
            return NextResponse.json(
              {
                error: `Hourly AI generation rate limit reached (${MAX_REQUESTS_PER_HOUR}/hr). Please wait ${minutesLeft} minute(s) or upgrade to Premium for unlimited AI drafting.`,
              },
              { status: 429 }
            );
          }
          userRate.count += 1;
        } else {
          // Reset window
          rateLimitMap.set(churchKey, { count: 1, resetAt: now + 3600000 });
        }
      } else {
        rateLimitMap.set(churchKey, { count: 1, resetAt: now + 3600000 });
      }
    }

    const { topic, templateType, keyPoints } = await req.json();

    const output = await generateBroadcastEmailContentWithFallbacks({
      churchName: church.name,
      topic,
      templateType,
      keyPoints,
    });

    return NextResponse.json({
      success: true,
      data: output,
      rateLimit: isPremium
        ? { unlimited: true }
        : {
            remaining: Math.max(0, MAX_REQUESTS_PER_HOUR - (rateLimitMap.get(churchKey)?.count || 1)),
            limit: MAX_REQUESTS_PER_HOUR,
          },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("AI Email generation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate email copy." },
      { status: 500 }
    );
  }
}
