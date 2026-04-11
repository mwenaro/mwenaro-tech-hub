import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.mwenaro.com',
  port: 465,
  secure: true,
  auth: {
    user: 'plugnpay@mwenaro.com',
    pass: process.env.SMTP_PASS || 'Pa$$word@1211',
  },
});

const budgetLabels: Record<string, string> = {
  under_10k: 'Under $10,000',
  '10k_50k': '$10,000 - $50,000',
  '50k_100k': '$50,000 - $100,000',
  over_100k: 'Over $100,000',
  not_sure: 'Not sure yet',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, company, email, budget, description } = body;

    if (!firstName || !lastName || !email || !description) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    const budgetLabel = budgetLabels[budget] || 'Not specified';

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e85a3b;">New Project Inquiry</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${company || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Budget</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${budgetLabel}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Project Description</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${description.replace(/\n/g, '<br>')}</td>
          </tr>
        </table>
      </div>
    `;

    const info = await transporter.sendMail({
      from: 'Mwenaro Labs <noreply@mwenaro.com>',
      to: 'labs@mwenaro.com',
      subject: `New Project Inquiry from ${firstName} ${lastName}`,
      html,
    });

    console.log('Contact form email sent:', info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
