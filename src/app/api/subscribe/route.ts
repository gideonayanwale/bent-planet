import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSubscriberWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { churchId, conferenceId, fullName, email, phone } = await req.json();

    if (!churchId || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields (churchId, fullName, email)" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Insert or update subscriber
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

    if (insertError) {
      console.error("Subscriber insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save subscription" },
        { status: 500 }
      );
    }

    // Trigger Welcome Email in background if conference is attached
    if (conferenceId) {
      try {
        const [churchRes, confRes] = await Promise.all([
          adminClient.from("churches").select("name, logo_url, whatsapp_group_url, whatsapp_channel_url, whatsapp_url").eq("id", churchId).maybeSingle(),
          adminClient.from("conferences").select("title, conference_date, conference_time, stream_url, whatsapp_group_url, whatsapp_channel_url, free_resource_url, free_resource_name").eq("id", conferenceId).maybeSingle(),
        ]);

        const church = churchRes.data;
        const conf = confRes.data;

        if (church && conf) {
          // Trigger in-app notification for church admin
          await adminClient.from("notifications").insert({
            church_id: churchId,
            type: "subscriber",
            title: "New Attendee Registered",
            message: `${fullName} registered for ${conf.title}.`,
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
              subscriber_id: subscriber?.id,
              email_type: "welcome",
              subject: `Welcome to ${church.name}`,
              resend_email_id: resendId,
            });
          }
        } else if (church) {
          // General church subscriber
          await adminClient.from("notifications").insert({
            church_id: churchId,
            type: "subscriber",
            title: "New Church Subscriber",
            message: `${fullName} joined ${church.name}'s general update list.`,
            action_url: "/dashboard/subscribers",
          });
        }
      } catch (emailErr) {
        console.error("Welcome email / notification error (non-fatal):", emailErr);
      }
    } else {
      // Direct general subscriber without specific conference
      try {
        await adminClient.from("notifications").insert({
          church_id: churchId,
          type: "subscriber",
          title: "New Subscriber",
          message: `${fullName} joined your subscriber list.`,
          action_url: "/dashboard/subscribers",
        });
      } catch (notifErr) {
        console.error("Notification insert error:", notifErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Subscribe API error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
