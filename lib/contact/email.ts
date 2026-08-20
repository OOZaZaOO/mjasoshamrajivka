import nodemailer from "nodemailer";
import type { ContactPayload } from "./schema";

export async function sendEmail(payload: ContactPayload) {
  const host = process.env.CONTACT_SMTP_HOST;
  const port = Number(process.env.CONTACT_SMTP_PORT ?? 587);
  const user = process.env.CONTACT_SMTP_USER;
  const password = process.env.CONTACT_SMTP_PASSWORD;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!host || !user || !password || !from || !to) throw new Error("Email is enabled but SMTP credentials are missing");
  if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error("SMTP port is invalid");
  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 10_000, auth: { user, pass: password } });
  await transporter.sendMail({ from, to, replyTo: payload.email, subject: `New contact request from ${payload.name}`, text: `Name: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\n\n${payload.message}` });
}
