import "dotenv/config";
import amqp from "amqplib";
import { BillReminderPrefix, ExchangeBillMindTopic } from "../routing/routing.js";
import { SimpleQueueType, AckType, subscribeJSON } from "../pubsub/consume.js";
import type { BillReminderEvent } from "../types/index.js";
import { sendReminderEmail } from "./mailer.js";
import { getBillsWithRemindersForToday } from "../db/queries/reminders.js";


const bills = await getBillsWithRemindersForToday();
console.log("Bills found:", bills);


async function main() {
  // Connection string (This is how your application will know where to connect to the RabbitMQ server):
  const rabbitConnString = process.env.RABBITMQ_URL;
  if (!rabbitConnString) throw new Error("Missing RABBITMQ_URL in .env");
  const conn = await amqp.connect(rabbitConnString); // creates a new connection to rabbitMQ
  console.log("BillMind notifier connected to RabbitMQ!");

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

  const ch = await conn.createChannel();
  await ch.assertExchange(ExchangeBillMindTopic, "topic", { durable: true });

  // Declares a Single queue (and binds it to an Exhange) 
  // subscribing to all reminder events via wildcard
  for (const bill of bills) {
    await subscribeJSON(
      conn, 
      ExchangeBillMindTopic, 
      `${BillReminderPrefix}.all`, // Queue: one queue for all reminders
      `${BillReminderPrefix}.*`,   // RKey: matches bill.reminder.anyone
      SimpleQueueType.Transient, 
      handlerLog()
    );
  }
}

export function handlerLog(): (event: BillReminderEvent) => Promise<AckType>{
  return async (event: BillReminderEvent): Promise<AckType> => {
    await sendReminderEmail(event);
    console.log(`Reminder: ${event.recipientUsername} - ${event.billName} due in ${event.daysBeforeDue} days`);
    return AckType.Ack;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
})