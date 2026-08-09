import { NextResponse } from "next/server";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBroadcastEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return NextResponse.json({ error: "Church not found." }, { status: 403 });
    }

    const { subject, bodyContent, ctaUrl, ctaText } = await req.json();

    if (!subject || !bodyContent) {
      return NextResponse.json({ error: "Subject and Body content are required." }, { status: 400 });
    }

    // Fetch subscribers for this church
    const { data: subscribers, error: fetchErr } = await adminClient
      .from("subscribers")
      .select("id, full_name, email")
      .eq("church_id", church.id)
      .eq("unsubscribed", false);

    if (fetchErr || !subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers available to send broadcast." }, { status: 400 });
    }

    let sentCount = 0;

    // Send emails in background
    for (const sub of subscribers) {
      try {
        const resendId = await sendBroadcastEmail({
          toEmail: sub.email,
          subscriberName: sub.full_name,
          churchName: church.name,
          churchLogo: church.logo_url,
          subject,
          bodyContent,
          ctaUrl,
          ctaText,
        });

        if (resendId) {
          sentCount++;
          await adminClient.from("email_log").insert({
            church_id: church.id,
            subscriber_id: sub.id,
            email_type: "broadcast",
            subject,
            resend_email_id: resendId,
          });
        }
      } catch (e) {
        console.error(`Failed sending broadcast to ${sub.email}:`, e);
      }
    }

    return NextResponse.json({ success: true, count: sentCount });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Broadcast API error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
