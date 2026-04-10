const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.mwenaro.com',
  port: 465,
  secure: true,
  auth: {
    user: 'plugnpay@mwenaro.com',
    pass: process.argv[2] || 'Pa$$word@1211',
  },
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: 'Mwenaro Labs <noreply@mwenaro.com>',
      to: 'test@mwenaro.com',
      subject: 'Test Email',
      html: '<p>Test email from Labs</p>',
    });
    console.log('SUCCESS:', info.messageId);
  } catch (err) {
    console.log('ERROR:', err.message);
  }
}

test();