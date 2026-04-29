import amqp from "amqplib";
import cron from "node-cron";
import { publishJSON } from "../pubsub/publish.js";
import { BillReminderPrefix, ExchangeBillMindTopic } from "../routing/routing.js";
import type { BillReminderEvent } from "../types/index.js";


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

  cron.schedule('* * * * *', async () => {
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