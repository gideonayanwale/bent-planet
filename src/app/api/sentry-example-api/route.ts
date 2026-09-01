import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    throw new Error("Sentry Server Route Test Error: Testing server-side telemetry on Bent Planet");
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, message: "Sentry server error captured and transmitted to Sentry dashboard." },
      { status: 500 }
    );
  }
}
