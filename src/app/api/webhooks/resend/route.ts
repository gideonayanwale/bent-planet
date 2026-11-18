import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_WEBHOOK_BYTES = 1024 * 1024;
const MAX_TIMESTAMP_AGE_SECONDS = 5 * 60;

function isValidResendSignature(rawBody: string, request: Request, secret: string) {
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signatures = request.headers.get("svix-signature");

  if (!id || !timestamp || !signatures || !secret.startsWith("whsec_")) return false;

  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds) ||
      Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds) > MAX_TIMESTAMP_AGE_SECONDS) {
    return false;
  }

  try {
    const key = Buffer.from(secret.slice("whsec_".length), "base64");
    if (key.length === 0) return false;
    const expected = createHmac("sha256", key)
      .update(id + "." + timestamp + "." + rawBody, "utf8")
      .digest();

    return signatures.split(/\s+/).some((entry) => {
      const [version, encoded] = entry.split(",");
      if (version !== "v1" || !encoded) return false;
      const received = Buffer.from(encoded, "base64");
      return received.length === expected.length && timingSafeEqual(received, expected);
    });
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RESEND_WEBHOOK_SECRET is not configured; rejecting webhook.");
    return NextResponse.json({ error: "Webhook authentication is not configured." }, { status: 503 });
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  try {
    const rawBody = await req.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_WEBHOOK_BYTES) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }
    if (!isValidResendSignature(rawBody, req, secret)) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const events = Array.isArray(payload) ? payload : [payload];
    if (events.length > 100) {
      return NextResponse.json({ error: "Too many webhook events." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    for (const event of events) {
      if (!event?.type || !event?.data?.email_id) continue;
      const emailId = event.data.email_id;
      if (typeof emailId !== "string" || emailId.length > 255) continue;

      if (event.type === "email.opened") {
        const { error } = await adminClient.from("email_log").update({ opened: true }).eq("resend_email_id", emailId);
        if (error) throw new Error(error.message);
      } else if (event.type === "email.clicked") {
        const { error } = await adminClient.from("email_log").update({ clicked: true }).eq("resend_email_id", emailId);
        if (error) throw new Error(error.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Resend webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 400 });
  }
}
