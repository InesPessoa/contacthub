import { createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-transport';
import process from 'process';

interface MailOptions {
  emailFrom: string;
  emailTo: string;
  subject: string;
  message: string;
}

const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
} as Options);

export const sendEmail = async (options: MailOptions): Promise<void> => {
  await transporter.sendMail({
    from: options.emailFrom,
    to: options.emailTo,
    subject: options.subject,
    text: options.message,
  });
};
