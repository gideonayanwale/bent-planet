import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { isSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const feedbackSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().max(120).optional().nullable(),
  category: z.enum(["feedback", "support", "feature_request", "other", "bug_report", "general"]).optional(),
  message: z.string().trim().min(10).max(5000),
  churchId: z.string().uuid().optional().nullable(),
  church_id: z.string().uuid().optional().nullable(),
});

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;
const feedbackWindows = new Map<string, { count: number; resetAt: number }>();

function overLimit(ip: string) {
  const now = Date.now();
  const current = feedbackWindows.get(ip);
  if (!current || current.resetAt <= now) {
    feedbackWindows.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(req: Request) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 16 * 1024) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (overLimit(ip)) {
      return NextResponse.json({ error: "Too many feedback submissions. Please try again later." }, { status: 429 });
    }

    const parsed = feedbackSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a valid email and feedback message." }, { status: 400 });
    }

    const { email, name, category, message, churchId, church_id } = parsed.data;
    const requestedChurchId = churchId || church_id || null;
    const user = await getCurrentUser();
    const adminClient = createAdminClient();
    let targetChurchId: string | null = null;
    let senderEmail = email;

    if (user?.email) {
      senderEmail = user.email;
      if (isSuperAdmin(user.email)) {
        targetChurchId = requestedChurchId;
      } else {
        const church = await getChurchByAdminEmail(adminClient, user.email);
        if (requestedChurchId && requestedChurchId !== church?.id) {
          return NextResponse.json({ error: "You cannot submit feedback for another church." }, { status: 403 });
        }
        targetChurchId = church?.id || null;
      }
    } else if (requestedChurchId) {
      return NextResponse.json({ error: "Sign in before sending church-specific feedback." }, { status: 401 });
    }

    if (targetChurchId) {
      const { data: church, error: churchError } = await adminClient
        .from("churches")
        .select("id")
        .eq("id", targetChurchId)
        .maybeSingle();
      if (churchError || !church) {
        return NextResponse.json({ error: "Church workspace not found." }, { status: 404 });
      }
    }

    const { error: insertError } = await adminClient.from("feedback_messages").insert({
      church_id: targetChurchId,
      user_email: senderEmail,
      user_name: name || null,
      category: category || "feedback",
      message,
      status: "unread",
    });

    if (insertError) {
      console.error("Feedback insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit feedback." }, { status: 500 });
    }

    const { error: notificationError } = await adminClient.from("notifications").insert({
      church_id: targetChurchId,
      type: "feedback",
      title: "New Feedback (" + (category || "General") + ")",
      message: (name ? name + " (" + senderEmail + ")" : senderEmail) + ": " + message.slice(0, 80) + (message.length > 80 ? "..." : ""),
      action_url: targetChurchId ? "/dashboard" : "/super-admin",
      read: false,
    });
    if (notificationError) console.error("Feedback notification error:", notificationError);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Feedback API error:", error);
    return NextResponse.json({ error: "Failed to submit feedback." }, { status: 500 });
  }
}
