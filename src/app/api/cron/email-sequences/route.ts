import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendConferenceReminderEmail,
  sendSubscriberWelcomeEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Vercel Cron Job: runs daily at 8am UTC
 * Handles:
 *   1. 7-day reminders
 *   2. 24-hour reminders
 *   3. Post-conference replay emails
 */
export async function GET(request: Request) {
  // Secure with CRON_SECRET header
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const results = { reminders7d: 0, reminders24h: 0, replayEmails: 0, errors: 0 };

  try {
    const now = new Date();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 1. 7-DAY REMINDERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const in7Days = new Date(now);
    in7Days.setDate(in7Days.getDate() + 7);
    const in6Days = new Date(now);
    in6Days.setDate(in6Days.getDate() + 6);

    const { data: conferences7d } = await adminClient
      .from("conferences")
      .select("id, title, conference_date, conference_time, stream_url, timezone, church_id, churches(name, logo_url)")
      .eq("status", "published")
      .gte("conference_date", in6Days.toISOString().split("T")[0])
      .lte("conference_date", in7Days.toISOString().split("T")[0]);

    for (const conf of conferences7d || []) {
      const { data: subscribers } = await adminClient
        .from("subscribers")
        .select("id, full_name, email")
        .eq("conference_id", conf.id)
        .eq("reminder_7d_sent", false);

      for (const sub of subscribers || []) {
        try {
          const church = conf.churches as unknown as { name: string; logo_url: string | null };
          await sendConferenceReminderEmail({
            toEmail: sub.email || "",
            subscriberName: sub.full_name || "Friend",
            churchName: church?.name || "",
            churchLogo: church?.logo_url,
            conferenceTitle: conf.title,
            conferenceDate: conf.conference_date,
            conferenceTime: conf.conference_time,
            streamUrl: conf.stream_url,
          });

          await adminClient
            .from("subscribers")
            .update({ reminder_7d_sent: true })
            .eq("id", sub.id);

          results.reminders7d++;
        } catch {
          results.errors++;
        }
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 2. 24-HOUR REMINDERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const in25h = new Date(now);
    in25h.setHours(in25h.getHours() + 25);
    const in23h = new Date(now);
    in23h.setHours(in23h.getHours() + 23);

    const { data: conferences24h } = await adminClient
      .from("conferences")
      .select("id, title, conference_date, conference_time, stream_url, churches(name, logo_url)")
      .eq("status", "published")
      .gte("conference_date", in23h.toISOString().split("T")[0])
      .lte("conference_date", in25h.toISOString().split("T")[0]);

    for (const conf of conferences24h || []) {
      const { data: subscribers } = await adminClient
        .from("subscribers")
        .select("id, full_name, email")
        .eq("conference_id", conf.id)
        .eq("reminder_24h_sent", false);

      for (const sub of subscribers || []) {
        try {
          const church = conf.churches as unknown as { name: string; logo_url: string | null };
          await sendConferenceReminderEmail({
            toEmail: sub.email || "",
            subscriberName: sub.full_name || "Friend",
            churchName: church?.name || "",
            churchLogo: church?.logo_url,
            conferenceTitle: conf.title,
            conferenceDate: conf.conference_date,
            conferenceTime: conf.conference_time,
            streamUrl: conf.stream_url,
          });

          await adminClient
            .from("subscribers")
            .update({ reminder_24h_sent: true })
            .eq("id", sub.id);

          results.reminders24h++;
        } catch {
          results.errors++;
        }
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 3. POST-CONFERENCE REPLAY EMAILS
    // Triggered ~24h after conference ended
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const { data: endedConfs } = await adminClient
      .from("conferences")
      .select("id, title, conference_date, stream_url, free_resource_url, free_resource_name, enable_replay, churches(name, logo_url)")
      .eq("status", "published")
      .eq("enable_replay", true)
      .gte("conference_date", twoDaysAgo.toISOString().split("T")[0])
      .lte("conference_date", yesterday.toISOString().split("T")[0]);

    for (const conf of endedConfs || []) {
      const { data: subscribers } = await adminClient
        .from("subscribers")
        .select("id, full_name, email")
        .eq("conference_id", conf.id)
        .eq("replay_email_sent", false);

      for (const sub of subscribers || []) {
        try {
          const church = conf.churches as unknown as { name: string; logo_url: string | null };
          // Send a replay/follow-up using the welcome email template with replay context
          await sendSubscriberWelcomeEmail({
            toEmail: sub.email || "",
            subscriberName: sub.full_name || "Friend",
            churchName: church?.name || "",
            churchLogo: church?.logo_url,
            conferenceTitle: `[REPLAY] ${conf.title}`,
            streamUrl: conf.stream_url,
            freeResourceUrl: conf.free_resource_url,
            freeResourceName: conf.free_resource_name || "Conference Replay",
          });

          await adminClient
            .from("subscribers")
            .update({ replay_email_sent: true })
            .eq("id", sub.id);

          results.replayEmails++;
        } catch {
          results.errors++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      ran_at: now.toISOString(),
      ...results,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Cron job error:", err);
    return NextResponse.json({ error: err.message || "Cron job failed" }, { status: 500 });
  }
}
