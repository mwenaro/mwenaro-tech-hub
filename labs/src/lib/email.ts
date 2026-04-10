import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.mwenaro.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT !== '587',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Mwenaro Labs <noreply@mwenaro.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendInviteEmail(email: string, inviteLink: string, invitedBy: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You're invited to Mwenaro Labs!</h2>
      <p>${invitedBy} has invited you to join Mwenaro Labs to collaborate on a project.</p>
      <p>Click the button below to accept the invitation:</p>
      <a href="${inviteLink}" style="display: inline-block; background: #e85a3b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Accept Invitation</a>
      <p>This invitation will expire in 7 days.</p>
      <p>If you didn't expect this email, please ignore it.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'You\'re invited to Mwenaro Labs!',
    html,
  });
}

export async function sendWelcomeEmail(name: string, email: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Mwenaro Labs, ${name}!</h2>
      <p>We're excited to have you on board. You can now:</p>
      <ul>
        <li>Submit your project ideas</li>
        <li>Track your project progress</li>
        <li>Communicate with our team</li>
        <li>Make payments securely</li>
      </ul>
      <p>Get started by submitting your first project!</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Mwenaro Labs!',
    html,
  });
}

export async function sendStatusUpdateEmail(
  email: string,
  projectTitle: string,
  status: string,
  message?: string
) {
  const statusMessages: Record<string, string> = {
    accepted: 'Your project proposal has been accepted! We will be in touch soon.',
    rejected: 'Unfortunately, your project proposal was not accepted at this time.',
    active: 'Your project is now active and our team is working on it.',
    completed: 'Congratulations! Your project has been completed.',
  };

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Project Update: ${projectTitle}</h2>
      <p>Your project status has been updated to: <strong>${status}</strong></p>
      <p>${message || statusMessages[status] || 'There has been an update to your project.'}</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Project Update: ${projectTitle}`,
    html,
  });
}