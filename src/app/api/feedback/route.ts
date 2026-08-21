import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, name, category, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const { error: insertError } = await adminClient
      .from("feedback_messages")
      .insert({
        user_email: email,
        user_name: name || null,
        category: category || "feedback",
        message,
        status: "unread",
      });

    if (insertError) {
      console.error("Feedback insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to submit feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
