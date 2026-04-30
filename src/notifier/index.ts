import "dotenv/config";
import amqp from "amqplib";
import { BillReminderPrefix, ExchangeBillMindTopic } from "../routing/routing.js";
import { SimpleQueueType, AckType, subscribeJSON } from "../pubsub/consume.js";
import type { BillReminderEvent } from "../types/index.js";
import { sendReminderEmail } from "./mailer.js";


const dueDate = new Date();
dueDate.setDate(dueDate.getDate() + 7);

const email1 = process.env.GMAIL_USER_1;
const email2 = process.env.GMAIL_USER_2;
if (!email1 || !email2 ) throw new Error("Now email1 or email2");

const fakeBills = [
  {
    id: 1,
    name: "Rent",
    amount: 1500,
    dueDate: dueDate,
    members: [
      { username: "john", email: email1 },
      { username: "maria", email: email2 },
    ]
  }
]


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

  // For each client,
  // Declares a queue and binds it to an Exhange,
  // And consumes a new message from that queue.
  for (let bill of fakeBills) {
    for (let member of bill.members) {
      await subscribeJSON(
        conn, 
        ExchangeBillMindTopic, 
        `${BillReminderPrefix}.${member.username}`, // Queue: bill.reminder.username
        `${BillReminderPrefix}.${member.username}`, // RKey: bill.reminder.username
        SimpleQueueType.Transient, 
        handlerLog()
      );
    }
  }
}

export function handlerLog(): (event: BillReminderEvent) => Promise<AckType>{
  return async (event: BillReminderEvent): Promise<AckType> => {
    await sendReminderEmail(event);
    console.log(`Reminder: ${event.recipientUsername} - ${event.billName} due in ${event.daysUntilDue} days`);
    return AckType.Ack;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
})