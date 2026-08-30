import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { churchName, adminName, email, phone, website, denomination, country, notes } = body;

    if (!churchName || !adminName || !email) {
      return NextResponse.json(
        { error: "Church name, admin name, and email are required." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Check if an invite or church already exists with this email
    const { data: existingChurch } = await adminClient
      .from("churches")
      .select("id")
      .eq("admin_email", email.toLowerCase().trim())
      .maybeSingle();

    if (existingChurch) {
      return NextResponse.json(
        { error: "A church workspace with this email already exists. Please log in." },
        { status: 400 }
      );
    }

    const { error: insertError } = await adminClient
      .from("access_requests")
      .insert({
        church_name: churchName,
        admin_name: adminName,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        website: website || null,
        denomination: denomination || null,
        country: country || null,
        notes: notes || null,
        status: "pending",
      });

    if (insertError) {
      console.error("Access request insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to submit request. Please try again." },
        { status: 500 }
      );
    }

    // Trigger super-admin notification
    try {
      await adminClient
        .from("notifications")
        .insert({
          church_id: null,
          type: "request",
          title: "New Access Request",
          message: `${adminName} has requested a workspace for "${churchName}" (${email.toLowerCase().trim()}).`,
          action_url: "/super-admin",
          read: false,
        });
    } catch (notifErr) {
      console.error("Failed to create super-admin notification:", notifErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Access request error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to submit access request" },
      { status: 500 }
    );
  }
}
