import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Online Conference";
    const churchName = searchParams.get("church") || "Bent Planet Church";
    const speaker = searchParams.get("speaker") || "";
    const date = searchParams.get("date") || "";
    const theme = searchParams.get("theme") || "SPECIAL EVENT";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "60px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
            color: "white",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: "absolute",
              top: "-200px",
              right: "-200px",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(0,0,0,0) 70%)",
            }}
          />

          {/* Top Bar / Branding */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 10 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "8px 20px",
                borderRadius: "999px",
                fontSize: "16px",
                fontWeight: "700",
                letterSpacing: "2px",
                color: "#a5b4fc",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {theme.toUpperCase()}
            </div>
            <span style={{ fontSize: "20px", color: "#94a3b8" }}>•</span>
            <span style={{ fontSize: "22px", fontWeight: "600", color: "#cbd5e1" }}>
              {churchName}
            </span>
          </div>

          {/* Main Title & Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", zIndex: 10, maxWidth: "900px" }}>
            <div
              style={{
                fontSize: title.length > 30 ? "54px" : "68px",
                fontWeight: "800",
                lineHeight: "1.1",
                letterSpacing: "-1px",
                color: "#ffffff",
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              {title}
            </div>

            {speaker && (
              <div style={{ fontSize: "28px", color: "#818cf8", fontWeight: "600" }}>
                Ministering: {speaker}
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              paddingTop: "24px",
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: "22px", color: "#e2e8f0", fontWeight: "500" }}>
              {date ? `🗓️ ${date}` : "Register Free Online"}
            </div>
            <div style={{ fontSize: "20px", color: "#a5b4fc", fontWeight: "700" }}>
              BENT PLANET
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error("OG Image Error:", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
