import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EMAIL_THEME_PRESETS, type EmailThemeStyle } from "@/lib/email-templates";

export interface AnnouncementEmailProps {
  subscriberName: string;
  churchName: string;
  churchLogo?: string | null;
  subject: string;
  bodyContent: string;
  ctaUrl?: string | null;
  ctaText?: string | null;
  themeStyle?: EmailThemeStyle;
  badgeLabel?: string | null;
  preheader?: string | null;
  scriptureVerse?: string | null;
  scriptureReference?: string | null;
  secondaryLinkUrl?: string | null;
  secondaryLinkText?: string | null;
}

export const AnnouncementEmail = ({
  subscriberName,
  churchName,
  churchLogo,
  subject,
  bodyContent,
  ctaUrl,
  ctaText,
  themeStyle = "modern_indigo",
  badgeLabel,
  preheader,
  scriptureVerse,
  scriptureReference,
  secondaryLinkUrl,
  secondaryLinkText,
}: AnnouncementEmailProps) => {
  const theme = EMAIL_THEME_PRESETS[themeStyle] || EMAIL_THEME_PRESETS.modern_indigo;

  return (
    <Html>
      <Head />
      <Preview>{preheader || subject}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header Banner */}
          <Section
            style={{
              background: theme.headerBg,
              padding: "32px 24px",
              borderRadius: "16px 16px 0 0",
              textAlign: "center" as const,
            }}
          >
            {churchLogo ? (
              <Img
                src={churchLogo}
                width="64"
                height="64"
                alt={churchName}
                style={{
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  backgroundColor: "#ffffff",
                }}
              />
            ) : null}

            {badgeLabel ? (
              <Text
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  letterSpacing: "0.05em",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                {badgeLabel}
              </Text>
            ) : null}

            <Heading
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: theme.headerText,
                margin: "4px 0 0",
                letterSpacing: "-0.02em",
              }}
            >
              {churchName}
            </Heading>
          </Section>

          {/* Email Body Content */}
          <Section style={{ padding: "32px 24px", backgroundColor: "#ffffff" }}>
            <Heading
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: "#0f172a",
                margin: "0 0 16px",
                lineHeight: "1.3",
              }}
            >
              {subject}
            </Heading>

            <Text
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#334155",
                margin: "0 0 16px",
              }}
            >
              Hello {subscriberName || "Beloved"},
            </Text>

            {/* Scripture Highlight Box if present */}
            {scriptureVerse ? (
              <Section
                style={{
                  backgroundColor: theme.highlightBoxBg,
                  borderLeft: `4px solid ${theme.primaryColor}`,
                  borderRadius: "8px",
                  padding: "16px",
                  margin: "0 0 20px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontStyle: "italic",
                    color: theme.highlightBoxText,
                    margin: "0 0 6px",
                    lineHeight: "1.5",
                  }}
                >
                  &ldquo;{scriptureVerse}&rdquo;
                </Text>
                {scriptureReference ? (
                  <Text
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: theme.primaryColor,
                      margin: "0",
                      textAlign: "right" as const,
                    }}
                  >
                    — {scriptureReference}
                  </Text>
                ) : null}
              </Section>
            ) : null}

            <div
              style={{
                fontSize: "15px",
                lineHeight: "26px",
                color: "#475569",
                margin: "0 0 24px",
                whiteSpace: "pre-wrap" as const,
              }}
              dangerouslySetInnerHTML={{
                __html: bodyContent.replace(/\n/g, "<br/>"),
              }}
            />

            {/* Primary Action Button */}
            {ctaUrl && (
              <Section style={{ textAlign: "center" as const, margin: "28px 0 16px" }}>
                <Button
                  style={{
                    backgroundColor: theme.buttonBg,
                    color: theme.buttonText,
                    borderRadius: "10px",
                    fontSize: "15px",
                    fontWeight: "700",
                    textDecoration: "none",
                    textAlign: "center" as const,
                    display: "inline-block",
                    padding: "14px 28px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                  href={ctaUrl}
                >
                  {ctaText || "Learn More & Register"}
                </Button>
              </Section>
            )}

            {/* Secondary Link if present */}
            {secondaryLinkUrl && (
              <Section style={{ textAlign: "center" as const, margin: "0 0 16px" }}>
                <Link
                  href={secondaryLinkUrl}
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.primaryColor,
                    textDecoration: "underline",
                  }}
                >
                  {secondaryLinkText || "Join Community / Group Chat →"}
                </Link>
              </Section>
            )}
          </Section>

          <Hr style={{ borderColor: "#f1f5f9", margin: "0" }} />

          {/* Footer */}
          <Section
            style={{
              padding: "24px",
              backgroundColor: "#f8fafc",
              borderRadius: "0 0 16px 16px",
              textAlign: "center" as const,
            }}
          >
            <Text
              style={{
                color: "#64748b",
                fontSize: "12px",
                lineHeight: "18px",
                margin: "0 0 6px",
              }}
            >
              Sent by {churchName} via Bent Planet — The Online Conference Platform for Churches.
            </Text>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: "11px",
                lineHeight: "16px",
                margin: "0",
              }}
            >
              Hosting a church conference or live ministry event?{" "}
              <Link
                href="https://bentplanet.com/request-access"
                style={{
                  color: theme.primaryColor,
                  textDecoration: "underline",
                  fontWeight: "600",
                }}
              >
                Request Access on Bent Planet
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AnnouncementEmail;

const mainStyle = {
  backgroundColor: "#f1f5f9",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const containerStyle = {
  margin: "40px auto",
  maxWidth: "580px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
  overflow: "hidden" as const,
};
