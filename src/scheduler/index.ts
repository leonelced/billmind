import "dotenv/config";
import amqp from "amqplib";
import cron from "node-cron";
import { publishJSON } from "../pubsub/publish.js";
import { BillReminderPrefix, ExchangeBillMindTopic } from "../routing/routing.js";
import type { BillReminderEvent } from "../types/index.js";


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

  cron.schedule('*/5 * * * *', async () => {
    console.log("Running every minute");
    for (let bill of fakeBills) {
      for (let member of bill.members) {
        await publishJSON<BillReminderEvent>(
          publishCh, 
          ExchangeBillMindTopic, 
          `${BillReminderPrefix}.${member.username}`, 
          {
            billId: bill.id,
            billName: bill.name,
            amount: bill.amount,
            dueDate: bill.dueDate,
            recipientEmail: member.email,
            recipientUsername: member.username,
            daysUntilDue: Math.floor((bill.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
          }
        );
      }
    }
  });
}


main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
})