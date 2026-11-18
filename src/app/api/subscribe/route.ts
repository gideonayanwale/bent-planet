import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSubscriberWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const subscriptionSchema = z.object({
  churchId: z.string().uuid(),
  conferenceId: z.string().uuid().optional().nullable(),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(32).optional().nullable(),
});

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const ipWindows = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = ipWindows.get(ip);
  if (!current || current.resetAt <= now) {
    ipWindows.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(req: Request) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 16 * 1024) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many subscription attempts. Please try again shortly." }, { status: 429 });
    }

    const parsed = subscriptionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a valid name, email and church." }, { status: 400 });
    }

    const { churchId, conferenceId, fullName, email, phone } = parsed.data;
    const adminClient = createAdminClient();

    const { data: church, error: churchError } = await adminClient
      .from("churches")
      .select("id, name, logo_url, whatsapp_group_url, whatsapp_channel_url, whatsapp_url, status")
      .eq("id", churchId)
      .maybeSingle();

    if (churchError || !church || church.status === "suspended") {
      return NextResponse.json({ error: "This church workspace is unavailable." }, { status: 404 });
    }

    let conf: {
      title: string;
      conference_date: string | null;
      conference_time: string | null;
      stream_url: string | null;
      whatsapp_group_url: string | null;
      whatsapp_channel_url: string | null;
      free_resource_url: string | null;
      free_resource_name: string | null;
    } | null = null;

    if (conferenceId) {
      const { data, error } = await adminClient
        .from("conferences")
        .select("title, conference_date, conference_time, stream_url, whatsapp_group_url, whatsapp_channel_url, free_resource_url, free_resource_name")
        .eq("id", conferenceId)
        .eq("church_id", churchId)
        .eq("status", "published")
        .maybeSingle();

      if (error || !data) {
        return NextResponse.json({ error: "The selected event is not available for registration." }, { status: 404 });
      }
      conf = data;
    }

    const { data: subscriber, error: insertError } = await adminClient
      .from("subscribers")
      .upsert(
        {
          church_id: churchId,
          conference_id: conferenceId || null,
          full_name: fullName,
          email,
          phone: phone || null,
        },
        { onConflict: "church_id, email" }
      )
      .select("id")
      .single();

    if (insertError || !subscriber) {
      console.error("Subscriber insert error:", insertError);
      return NextResponse.json({ error: "Failed to save subscription." }, { status: 500 });
    }

    if (conf) {
      try {
        await adminClient.from("notifications").insert({
          church_id: churchId,
          type: "subscriber",
          title: "New Attendee Registered",
          message: fullName + " registered for " + conf.title + ".",
          action_url: "/dashboard/subscribers",
        });

        const resendId = await sendSubscriberWelcomeEmail({
          toEmail: email,
          subscriberName: fullName,
          churchName: church.name,
          churchLogo: church.logo_url,
          conferenceTitle: conf.title,
          conferenceDate: conf.conference_date,
          conferenceTime: conf.conference_time,
          streamUrl: conf.stream_url,
          whatsappGroupUrl: conf.whatsapp_group_url || church.whatsapp_group_url || church.whatsapp_url,
          whatsappChannelUrl: conf.whatsapp_channel_url || church.whatsapp_channel_url,
          freeResourceUrl: conf.free_resource_url,
          freeResourceName: conf.free_resource_name,
        });

        if (resendId) {
          await adminClient.from("email_log").insert({
            church_id: churchId,
            conference_id: conferenceId,
            subscriber_id: subscriber.id,
            email_type: "welcome",
            subject: "Welcome to " + church.name,
            resend_email_id: resendId,
          });
        }
      } catch (emailErr) {
        console.error("Welcome email / notification error (non-fatal):", emailErr);
      }
    } else {
      const { error: notificationError } = await adminClient.from("notifications").insert({
        church_id: churchId,
        type: "subscriber",
        title: "New Subscriber",
        message: fullName + " joined " + church.name + "'s general update list.",
        action_url: "/dashboard/subscribers",
      });
      if (notificationError) console.error("Subscriber notification error:", notificationError);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Subscribe API error:", error);
    return NextResponse.json({ error: "Unable to complete subscription right now." }, { status: 500 });
  }
}
