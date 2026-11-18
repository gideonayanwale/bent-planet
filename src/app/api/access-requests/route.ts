import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  churchName: z.string().trim().min(2).max(160),
  adminName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(32).optional().nullable(),
  website: z.string().trim().max(2048).optional().nullable(),
  denomination: z.string().trim().max(120).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
  notes: z.string().trim().max(3000).optional().nullable(),
});

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 3;
const requestWindows = new Map<string, { count: number; resetAt: number }>();

function overLimit(ip: string) {
  const now = Date.now();
  const current = requestWindows.get(ip);
  if (!current || current.resetAt <= now) {
    requestWindows.set(ip, { count: 1, resetAt: now + WINDOW_MS });
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
      return NextResponse.json({ error: "Too many access requests. Please try again later." }, { status: 429 });
    }

    const parsed = requestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete the required fields with valid information." }, { status: 400 });
    }

    const { churchName, adminName, email, phone, website, denomination, country, notes } = parsed.data;
    if (website) {
      try {
        const normalizedWebsite = website.toLowerCase().startsWith("http://") || website.toLowerCase().startsWith("https://") ? website : "https://" + website;
        const websiteUrl = new URL(normalizedWebsite);
        if (websiteUrl.protocol !== "https:" && websiteUrl.protocol !== "http:") {
          return NextResponse.json({ error: "Please provide a valid website URL." }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Please provide a valid website URL." }, { status: 400 });
      }
    }

    const adminClient = createAdminClient();
    const { data: existingChurch, error: lookupError } = await adminClient
      .from("churches")
      .select("id")
      .eq("admin_email", email)
      .maybeSingle();

    if (lookupError) throw new Error(lookupError.message);
    if (existingChurch) {
      return NextResponse.json({ error: "A church workspace with this email already exists. Please log in." }, { status: 400 });
    }

    const { error: insertError } = await adminClient.from("access_requests").insert({
      church_name: churchName,
      admin_name: adminName,
      email,
      phone: phone || null,
      website: website || null,
      denomination: denomination || null,
      country: country || null,
      notes: notes || null,
      status: "pending",
    });

    if (insertError) {
      console.error("Access request insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit request. Please try again." }, { status: 500 });
    }

    const { error: notificationError } = await adminClient.from("notifications").insert({
      church_id: null,
      type: "request",
      title: "New Access Request",
      message: adminName + " has requested a workspace for " + churchName + " (" + email + ").",
      action_url: "/super-admin",
      read: false,
    });
    if (notificationError) console.error("Access request notification error:", notificationError);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Access request error:", error);
    return NextResponse.json({ error: "Failed to submit request. Please try again." }, { status: 500 });
  }
}
