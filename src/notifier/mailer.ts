import "dotenv/config";
import nodemailer from "nodemailer";
import { type BillReminderEvent } from "../types/index.js";


export async function sendReminderEmail(event:BillReminderEvent): Promise<void> {

  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_PASSWORD;

  if (!gmailUser || !gmailPassword) {
    throw new Error("Missing GMAIL_USER or GMAIL_PASSWORD in .env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    }
  });

  await transporter.sendMail({
    from: `BillMind <${gmailUser}>`,
    to: event.recipientEmail,
    subject: `Reminder: ${event.billName} is due in ${event.daysUntilDue} days`,
    text: `Hi ${event.recipientUsername}, your bill ${event.billName} ${event.amount ? `of $${event.amount}` : ''} is due in ${event.daysUntilDue} days.`,
  })

}