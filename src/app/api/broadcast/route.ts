import { NextResponse } from "next/server";
import { z } from "zod";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBroadcastEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const safeUrl = z.string().trim().max(2048).optional().nullable().refine((value) => {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
});

const broadcastSchema = z.object({
  subject: z.string().trim().min(2).max(150).refine((value) => !/[\r\n]/.test(value)),
  bodyContent: z.string().trim().min(1).max(20000),
  ctaUrl: safeUrl,
  ctaText: z.string().trim().max(80).optional().nullable(),
  themeStyle: z.enum(["modern_indigo", "warm_amber", "revival_purple", "live_crimson", "emerald_growth", "cathedral_slate"]).optional(),
  badgeLabel: z.string().trim().max(80).optional().nullable(),
  preheader: z.string().trim().max(250).optional().nullable(),
  scriptureVerse: z.string().trim().max(1500).optional().nullable(),
  scriptureReference: z.string().trim().max(120).optional().nullable(),
  secondaryLinkUrl: safeUrl,
  secondaryLinkText: z.string().trim().max(80).optional().nullable(),
});

const broadcastWindows = new Map<string, { count: number; resetAt: number }>();
const MAX_BROADCASTS_PER_HOUR = 3;

export async function POST(req: Request) {
  try {
    const user = await requireChurchUser();
    if (!user.email) {
      return NextResponse.json({ error: "A church administrator session is required." }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const church = await getChurchByAdminEmail(adminClient, user.email);
    if (!church) {
      return NextResponse.json({ error: "Church not found." }, { status: 403 });
    }
    if (church.status === "suspended") {
      return NextResponse.json({ error: "This workspace has been suspended. Please contact operations support." }, { status: 403 });
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 32 * 1024) {
      return NextResponse.json({ error: "Broadcast content is too large." }, { status: 413 });
    }

    const parsed = broadcastSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the subject, message and link fields." }, { status: 400 });
    }

    const now = Date.now();
    const rateLimit = broadcastWindows.get(church.id);
    if (!rateLimit || rateLimit.resetAt <= now) {
      broadcastWindows.set(church.id, { count: 1, resetAt: now + 60 * 60 * 1000 });
    } else if (rateLimit.count >= MAX_BROADCASTS_PER_HOUR) {
      return NextResponse.json({ error: "Hourly broadcast limit reached. Please try again later." }, { status: 429 });
    } else {
      rateLimit.count += 1;
    }

    const {
      subject, bodyContent, ctaUrl, ctaText, themeStyle, badgeLabel, preheader,
      scriptureVerse, scriptureReference, secondaryLinkUrl, secondaryLinkText,
    } = parsed.data;

    const { data: subscribers, error: fetchErr } = await adminClient
      .from("subscribers")
      .select("id, full_name, email")
      .eq("church_id", church.id)
      .eq("unsubscribed", false);

    if (fetchErr) throw new Error("Unable to load active subscribers.");
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers available to send broadcast." }, { status: 400 });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: sentThisMonth, error: countError } = await adminClient
      .from("email_log")
      .select("id", { count: "exact", head: true })
      .eq("church_id", church.id)
      .gte("sent_at", startOfMonth.toISOString());

    if (countError) throw new Error("Unable to verify the monthly email allowance.");

    const maxEmails = church.max_emails_limit ?? 5000;
    const currentSent = sentThisMonth ?? 0;
    if (currentSent >= maxEmails || currentSent + subscribers.length > maxEmails) {
      return NextResponse.json({
        error: "This broadcast exceeds your monthly email allowance. " + Math.max(0, maxEmails - currentSent) + " emails remain for this month.",
      }, { status: 429 });
    }

    let sentCount = 0;
    for (const sub of subscribers) {
      try {
        const resendId = await sendBroadcastEmail({
          toEmail: sub.email,
          subscriberName: sub.full_name,
          churchName: church.name,
          churchLogo: church.logo_url,
          subject,
          bodyContent,
          ctaUrl: ctaUrl || null,
          ctaText: ctaText || null,
          themeStyle,
          badgeLabel: badgeLabel || null,
          preheader: preheader || null,
          scriptureVerse: scriptureVerse || null,
          scriptureReference: scriptureReference || null,
          secondaryLinkUrl: secondaryLinkUrl || null,
          secondaryLinkText: secondaryLinkText || null,
        });

        if (resendId) {
          sentCount++;
          const { error: logError } = await adminClient.from("email_log").insert({
            church_id: church.id,
            subscriber_id: sub.id,
            email_type: "broadcast",
            subject,
            resend_email_id: resendId,
          });
          if (logError) console.error("Broadcast email log insert failed:", logError);
        }
      } catch (error) {
        console.error("Broadcast send failed for subscriber:", sub.id, error);
      }
    }

    return NextResponse.json({ success: true, count: sentCount });
  } catch (error: unknown) {
    console.error("Broadcast API error:", error);
    return NextResponse.json({ error: "Unable to send the broadcast right now." }, { status: 500 });
  }
}
