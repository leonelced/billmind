import "dotenv/config";
import amqp from "amqplib";
import cron from "node-cron";
import { publishJSON } from "../pubsub/publish.js";
import { BillReminderPrefix, ExchangeBillMindTopic } from "../routing/routing.js";
import { getBillsWithRemindersForToday } from "../db/queries/reminders.js";
import type { BillReminderEvent } from "../types/index.js";
import type { ConfirmChannel } from "amqplib";


async function publishReminders(publishCh: ConfirmChannel) {
  console.log("Checking for upcoming bills...");
  const bills = await getBillsWithRemindersForToday();
  console.log("Bills found:", bills);

  for (const bill of bills) {
    const billReminderEvent: BillReminderEvent = {
      billId: bill.id,
      billName: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      daysBeforeDue: bill.daysBeforeDue,
      recipientUsername: bill.recipientUsername,
      recipientEmail: bill.recipientEmail,
    }
    await publishJSON<BillReminderEvent>(
      publishCh, 
      ExchangeBillMindTopic, 
      `${BillReminderPrefix}.${bill.recipientUsername}`, 
      billReminderEvent
    );
  }
}


async function main() {
  // Connection string (This is how your application will know where to connect to the RabbitMQ server):
  const rabbitConnString = process.env.RABBITMQ_URL;
  if (!rabbitConnString) throw new Error("Missing RABBITMQ_URL in .env");
  const conn = await amqp.connect(rabbitConnString); // creates a new connection to rabbitMQ
  console.log("BillMind scheduler connected to RabbitMQ!");

  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, async () => {
      try {
        await conn.close();
        console.log("RabbitMQ connection closed.");
      } catch (err) {
        console.error("Error closing RabbitMQ connection:", err);
      } finally {
        process.exit(0);
      }
    }),
  );

  const publishCh = await conn.createConfirmChannel();
  await publishCh.assertExchange(ExchangeBillMindTopic, "topic", { durable: true });

  await publishReminders(publishCh); // check imidiatelly

  // cron.schedule('0 8 * * *', async () => { // check at minute 0 of hour 8, every day
  cron.schedule('*/5 * * * *', async () => { // check every 5 minutes for testing purposes
    await publishReminders(publishCh);
  });
}


main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
})