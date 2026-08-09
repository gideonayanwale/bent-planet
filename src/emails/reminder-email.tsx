import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReminderEmailProps {
  subscriberName: string;
  churchName: string;
  churchLogo?: string | null;
  conferenceTitle: string;
  conferenceDate?: string | null;
  conferenceTime?: string | null;
  streamUrl?: string | null;
}

export const ReminderEmail = ({
  subscriberName,
  churchName,
  churchLogo,
  conferenceTitle,
  conferenceDate,
  conferenceTime,
  streamUrl,
}: ReminderEmailProps) => {
  const previewText = `Tomorrow! ${conferenceTitle} goes live 🔥`;

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

          <Heading style={h1}>Tomorrow! {conferenceTitle} 🔥</Heading>

          <Text style={paragraph}>
            Hi {subscriberName}, this is a quick reminder that <strong>{conferenceTitle}</strong> is happening tomorrow! Get ready for an empowering session.
          </Text>

          <Section style={detailsCard}>
            <Text style={detailsTitle}>🕒 Schedule Reminder</Text>
            <Text style={detailsText}>
              <strong>Date:</strong> {conferenceDate || "Tomorrow"}
              <br />
              <strong>Time:</strong> {conferenceTime || "Check website"}
            </Text>
          </Section>

          {streamUrl && (
            <Section style={btnContainer}>
              <Button style={button} href={streamUrl}>
                Bookmark Stream Page
              </Button>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Sent by {churchName} via Bent Planet.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReminderEmail;

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
  backgroundColor: "#fff7ed",
  border: "1px solid #ffedd5",
  borderRadius: "12px",
  padding: "16px 20px",
  margin: "20px 0",
};

const detailsTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#9a3412",
  margin: "0 0 8px",
};

const detailsText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#c2410c",
  margin: 0,
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#ea580c",
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
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "18px",
  textAlign: "center" as const,
};
