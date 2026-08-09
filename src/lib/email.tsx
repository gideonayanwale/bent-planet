import { render } from "@react-email/render";
import { Resend } from "resend";

import { ChurchInviteEmail } from "@/emails/church-invite-email";
import { WelcomeEmail } from "@/emails/welcome-email";
import { ReminderEmail } from "@/emails/reminder-email";
import { LiveNowEmail } from "@/emails/live-now-email";
import { AnnouncementEmail } from "@/emails/announcement-email";
import { getServerEnv } from "@/lib/env";

type SendChurchInviteEmailInput = {
  adminEmail: string;
  churchName: string;
  inviteUrl: string;
};

export async function sendChurchInviteEmail(input: SendChurchInviteEmailInput) {
  const env = getServerEnv();
  const resend = new Resend(env.RESEND_API_KEY);
  const html = await render(
    <ChurchInviteEmail churchName={input.churchName} inviteUrl={input.inviteUrl} />,
  );

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.adminEmail,
    subject: `Set up ${input.churchName} on Bent Planet`,
    html,
  });

  if (error) {
    throw new Error(`Failed to send invite email: ${error.message}`);
  }
}

type SendWelcomeEmailInput = {
  toEmail: string;
  subscriberName: string;
  churchName: string;
  churchLogo?: string | null;
  conferenceTitle: string;
  conferenceDate?: string | null;
  conferenceTime?: string | null;
  streamUrl?: string | null;
  freeResourceUrl?: string | null;
  freeResourceName?: string | null;
};

export async function sendSubscriberWelcomeEmail(input: SendWelcomeEmailInput) {
  const env = getServerEnv();
  const resend = new Resend(env.RESEND_API_KEY);
  const html = await render(
    <WelcomeEmail
      subscriberName={input.subscriberName}
      churchName={input.churchName}
      churchLogo={input.churchLogo}
      conferenceTitle={input.conferenceTitle}
      conferenceDate={input.conferenceDate}
      conferenceTime={input.conferenceTime}
      streamUrl={input.streamUrl}
      freeResourceUrl={input.freeResourceUrl}
      freeResourceName={input.freeResourceName}
    />,
  );

  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.toEmail,
    subject: `Welcome to ${input.churchName} — You're registered for ${input.conferenceTitle} 🙌`,
    html,
  });

  if (error) {
    console.error("Failed to send welcome email:", error);
    return null;
  }
  return data?.id;
}

type SendReminderEmailInput = {
  toEmail: string;
  subscriberName: string;
  churchName: string;
  churchLogo?: string | null;
  conferenceTitle: string;
  conferenceDate?: string | null;
  conferenceTime?: string | null;
  streamUrl?: string | null;
};

export async function sendConferenceReminderEmail(input: SendReminderEmailInput) {
  const env = getServerEnv();
  const resend = new Resend(env.RESEND_API_KEY);
  const html = await render(
    <ReminderEmail
      subscriberName={input.subscriberName}
      churchName={input.churchName}
      churchLogo={input.churchLogo}
      conferenceTitle={input.conferenceTitle}
      conferenceDate={input.conferenceDate}
      conferenceTime={input.conferenceTime}
      streamUrl={input.streamUrl}
    />,
  );

  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.toEmail,
    subject: `Tomorrow! ${input.conferenceTitle} goes live 🔥`,
    html,
  });

  if (error) {
    console.error("Failed to send reminder email:", error);
    return null;
  }
  return data?.id;
}

type SendLiveNowEmailInput = {
  toEmail: string;
  subscriberName: string;
  churchName: string;
  churchLogo?: string | null;
  conferenceTitle: string;
  streamUrl: string;
};

export async function sendLiveNowEmail(input: SendLiveNowEmailInput) {
  const env = getServerEnv();
  const resend = new Resend(env.RESEND_API_KEY);
  const html = await render(
    <LiveNowEmail
      subscriberName={input.subscriberName}
      churchName={input.churchName}
      churchLogo={input.churchLogo}
      conferenceTitle={input.conferenceTitle}
      streamUrl={input.streamUrl}
    />,
  );

  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.toEmail,
    subject: `We're LIVE now — Join ${input.conferenceTitle} 🎙️`,
    html,
  });

  if (error) {
    console.error("Failed to send live now email:", error);
    return null;
  }
  return data?.id;
}

type SendBroadcastEmailInput = {
  toEmail: string;
  subscriberName: string;
  churchName: string;
  churchLogo?: string | null;
  subject: string;
  bodyContent: string;
  ctaUrl?: string | null;
  ctaText?: string | null;
};

export async function sendBroadcastEmail(input: SendBroadcastEmailInput) {
  const env = getServerEnv();
  const resend = new Resend(env.RESEND_API_KEY);
  const html = await render(
    <AnnouncementEmail
      subscriberName={input.subscriberName}
      churchName={input.churchName}
      churchLogo={input.churchLogo}
      subject={input.subject}
      bodyContent={input.bodyContent}
      ctaUrl={input.ctaUrl}
      ctaText={input.ctaText}
    />,
  );

  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.toEmail,
    subject: input.subject,
    html,
  });

  if (error) {
    console.error("Failed to send broadcast email:", error);
    return null;
  }
  return data?.id;
}
