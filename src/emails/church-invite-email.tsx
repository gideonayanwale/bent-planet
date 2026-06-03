import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ChurchInviteEmailProps = {
  churchName: string;
  inviteUrl: string;
};

export function ChurchInviteEmail({ churchName, inviteUrl }: ChurchInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Set up ${churchName} on Bent Planet`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={eyebrowRow}>
            <Text style={eyebrow}>Bent Planet</Text>
          </Section>
          <Heading style={heading}>Your church dashboard is ready to activate.</Heading>
          <Text style={copy}>
            You have been invited to onboard <strong>{churchName}</strong> on Bent Planet. Use the
            secure link below to set your password, upload your logo, and complete your church
            profile.
          </Text>
          <Button href={inviteUrl} style={button}>
            Complete church setup
          </Button>
          <Text style={copy}>
            This is a one-time onboarding link. If you did not expect this invitation, you can
            safely ignore this email.
          </Text>
          <Text style={footer}>Bent Planet helps churches publish and grow digital conferences.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f8fafc",
  color: "#0f172a",
  fontFamily: "'DM Sans', Arial, sans-serif",
  margin: 0,
  padding: "32px 12px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "24px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "36px 32px",
};

const eyebrowRow = {
  marginBottom: "12px",
};

const eyebrow = {
  color: "#2563eb",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  margin: 0,
  textTransform: "uppercase" as const,
};

const heading = {
  color: "#0f172a",
  fontFamily: "'Syne', Arial, sans-serif",
  fontSize: "30px",
  lineHeight: "1.15",
  margin: "0 0 20px",
};

const copy = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "1.7",
  margin: "0 0 20px",
};

const button = {
  backgroundColor: "#0f172a",
  borderRadius: "999px",
  color: "#f8fafc",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "700",
  marginBottom: "24px",
  padding: "14px 22px",
  textDecoration: "none",
};

const footer = {
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "12px 0 0",
};
