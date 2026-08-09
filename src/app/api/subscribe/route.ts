import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSubscriberWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { churchId, conferenceId, fullName, email, phone } = await req.json();

    if (!churchId || !conferenceId || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
          conference_id: conferenceId,
          full_name: fullName,
          email,
          phone,
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

    // Trigger Welcome Email in background
    try {
      const [churchRes, confRes] = await Promise.all([
        adminClient.from("churches").select("name, logo_url").eq("id", churchId).maybeSingle(),
        adminClient.from("conferences").select("title, conference_date, conference_time, stream_url, free_resource_url, free_resource_name").eq("id", conferenceId).maybeSingle(),
      ]);

      const church = churchRes.data;
      const conf = confRes.data;

      if (church && conf) {
        const resendId = await sendSubscriberWelcomeEmail({
          toEmail: email,
          subscriberName: fullName,
          churchName: church.name,
          churchLogo: church.logo_url,
          conferenceTitle: conf.title,
          conferenceDate: conf.conference_date,
          conferenceTime: conf.conference_time,
          streamUrl: conf.stream_url,
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
      }
    } catch (emailErr) {
      console.error("Welcome email error (non-fatal):", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
