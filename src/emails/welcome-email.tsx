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

interface WelcomeEmailProps {
  subscriberName: string;
  churchName: string;
  churchLogo?: string | null;
  conferenceTitle: string;
  conferenceDate?: string | null;
  conferenceTime?: string | null;
  streamUrl?: string | null;
  freeResourceUrl?: string | null;
  freeResourceName?: string | null;
}

export const WelcomeEmail = ({
  subscriberName,
  churchName,
  churchLogo,
  conferenceTitle,
  conferenceDate,
  conferenceTime,
  streamUrl,
  freeResourceUrl,
  freeResourceName,
}: WelcomeEmailProps) => {
  const previewText = `Welcome to ${churchName} — You're in for ${conferenceTitle}! 🙌`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {churchLogo ? (
            <Img src={churchLogo} width="64" height="64" alt={churchName} style={logo} />
          ) : (
            <Heading style={churchHeader}>{churchName}</Heading>
          )}

          <Heading style={h1}>Welcome, {subscriberName}! 🙌</Heading>

          <Text style={paragraph}>
            You have successfully registered for <strong>{conferenceTitle}</strong> hosted by{" "}
            <strong>{churchName}</strong>. We are thrilled to have you join us for this powerful gathering.
          </Text>

          {(conferenceDate || conferenceTime) && (
            <Section style={detailsCard}>
              <Text style={detailsTitle}>🗓️ Event Details</Text>
              <Text style={detailsText}>
                <strong>Date:</strong> {conferenceDate || "TBA"}
                <br />
                <strong>Time:</strong> {conferenceTime || "TBA"}
              </Text>
            </Section>
          )}

          {streamUrl && (
            <Section style={btnContainer}>
              <Button style={button} href={streamUrl}>
                Join Live Stream
              </Button>
            </Section>
          )}

          {freeResourceUrl && (
            <Section style={resourceBox}>
              <Text style={resourceHeading}>🎁 Free Resource Attached</Text>
              <Text style={paragraph}>
                As a subscriber, you get instant access to <strong>{freeResourceName || "Conference Guide & Notes"}</strong>.
              </Text>
              <Button style={secondaryButton} href={freeResourceUrl}>
                Download Free Resource
              </Button>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Sent with love from {churchName} via Bent Planet — The Online Conference Platform for Churches.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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
  fontSize: "24px",
  fontWeight: "700",
  color: "#0f172a",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#475569",
  margin: "0 0 16px",
};

const detailsCard = {
  backgroundColor: "#f1f5f9",
  borderRadius: "12px",
  padding: "16px 20px",
  margin: "20px 0",
};

const detailsTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#0f172a",
  margin: "0 0 8px",
};

const detailsText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#334155",
  margin: 0,
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const resourceBox = {
  backgroundColor: "#eef2ff",
  border: "1px solid #c7d2fe",
  borderRadius: "12px",
  padding: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const resourceHeading = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#3730a3",
  margin: "0 0 8px",
};

const secondaryButton = {
  backgroundColor: "#4338ca",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  padding: "10px 20px",
  marginTop: "12px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0 24px",
};

const footer = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "18px",
  textAlign: "center" as const,
};
