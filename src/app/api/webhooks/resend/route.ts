import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Resend sends webhooks as arrays or single objects depending on config
    const events = Array.isArray(payload) ? payload : [payload];
    const adminClient = createAdminClient();

    for (const event of events) {
      if (!event.type || !event.data || !event.data.email_id) continue;

      const emailId = event.data.email_id;

      if (event.type === "email.opened") {
        await adminClient
          .from("email_log")
          .update({ opened: true })
          .eq("resend_email_id", emailId);
      } else if (event.type === "email.clicked") {
        await adminClient
          .from("email_log")
          .update({ clicked: true })
          .eq("resend_email_id", emailId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Resend Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
