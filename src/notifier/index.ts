import amqp from "amqplib";
import { BillReminderPrefix, ExchangeBillMindTopic } from "../routing/routing.js";
import type { BillReminderEvent } from "../types/index.js";
import { SimpleQueueType, AckType, subscribeJSON } from "../pubsub/consume.js";


const fakeBills = [
    {
      id: 1,
      name: "Rent",
      amount: 1500,
      dueDate: new Date(),
      members: [
        { username: "leonel", email: "leonel@email.com" },
        { username: "maria", email: "maria@email.com" },
      ]
    }
  ]


async function main() {
  // Connection string (This is how your application will know where to connect to the RabbitMQ server):
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
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
    console.log(`Reminder: ${event.recipientUsername} - ${event.billName} due in ${event.daysUntilDue} days`);
    return AckType.Ack;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
})