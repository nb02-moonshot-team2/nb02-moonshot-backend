import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface MailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export const sendMail = async (options: MailOptions) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS,
    ...options,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('메일 전송 완료:', info.response);
  } catch (error) {
    console.error('메일 전송 실패:', error);
    throw error;
  }
};
