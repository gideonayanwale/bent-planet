import { render } from "@react-email/render";
import { Resend } from "resend";

import { ChurchInviteEmail } from "@/emails/church-invite-email";
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
