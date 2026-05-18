import { db } from "../client.js";
import { eq, sql } from "drizzle-orm";
import { bills, users, reminderRules, billMembers } from "../schema.js";


export async function getBillsWithRemindersForToday() {
  const result = await db
    .select({
      id: bills.id,
      name: bills.name,
      amount: bills.amount,
      dueDate: bills.dueDate,
      daysBeforeDue: reminderRules.daysBeforeDue,
      recipientUsername: users.username,
      recipientEmail: users.email,
    })
    .from(bills)
    .innerJoin(billMembers, eq(bills.id, billMembers.billId))
    .innerJoin(reminderRules, eq(billMembers.billId, reminderRules.billId))
    .innerJoin(users, eq(users.id, billMembers.userId))
    .where(
      sql`${bills.dueDate}::date - ${reminderRules.daysBeforeDue} * INTERVAL '1 day' = CURRENT_DATE`
    );

  return result;
}