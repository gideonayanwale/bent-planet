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

interface AnnouncementEmailProps {
  subscriberName: string;
  churchName: string;
  churchLogo?: string | null;
  subject: string;
  bodyContent: string;
  ctaUrl?: string | null;
  ctaText?: string | null;
}

export const AnnouncementEmail = ({
  subscriberName,
  churchName,
  churchLogo,
  subject,
  bodyContent,
  ctaUrl,
  ctaText,
}: AnnouncementEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {churchLogo ? (
            <Img src={churchLogo} width="64" height="64" alt={churchName} style={logo} />
          ) : (
            <Heading style={churchHeader}>{churchName}</Heading>
          )}

          <Heading style={h1}>{subject}</Heading>

          <Text style={greeting}>Hello {subscriberName},</Text>

          <div style={contentBox} dangerouslySetInnerHTML={{ __html: bodyContent.replace(/\n/g, "<br/>") }} />

          {ctaUrl && (
            <Section style={btnContainer}>
              <Button style={button} href={ctaUrl}>
                {ctaText || "Learn More & Register"}
              </Button>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Sent by {churchName} via Bent Planet — The Online Conference Platform for Churches.
          </Text>
          <Text style={subFooter}>
            Hosting a church conference or live ministry event?{" "}
            <Link href="https://bentplanet.com/request-access" style={footerLink}>
              Request Access on Bent Planet
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AnnouncementEmail;

const main = {
  backgroundColor: "#f8fafc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const logo = {
  margin: "0 auto 24px",
  borderRadius: "12px",
};

const churchHeader = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#0f172a",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const h1 = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#0f172a",
  margin: "0 0 16px",
};

const greeting = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#334155",
  margin: "0 0 12px",
};

const contentBox = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#475569",
  margin: "0 0 20px",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0 24px",
};

const footer = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "18px",
  textAlign: "center" as const,
  margin: "0 0 6px",
};

const subFooter = {
  color: "#94a3b8",
  fontSize: "11px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "0",
};

const footerLink = {
  color: "#4f46e5",
  textDecoration: "underline",
  fontWeight: "600",
};
