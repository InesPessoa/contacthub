import { createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-transport';
import process from 'process';

const transporter = createTransport({
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 1025, //add authentication
} as Options);

export const sendEmail = async (
  emailFrom: string,
  emailTo: string,
  subject: string,
  message: string
): Promise<void> => {
  await transporter.sendMail({
    from: emailFrom,
    to: emailTo,
    subject: subject,
    text: message,
  });
};
