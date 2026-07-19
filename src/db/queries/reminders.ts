import { db } from "../client.js";
import { eq, sql } from "drizzle-orm";
import { bills, users, reminderRules, billMembers } from "../schema.js";


export async function getBillsWithRemindersForToday() {
  const result = await db
    .select({
      id: bills.id,
      name: bills.name,
      amount: bills.amount,
      recurrence: bills.recurrence,
      dueDate: bills.dueDate,
      dueDayOfMonth: bills.dueDayOfMonth,
      dueMonth: bills.dueMonth,
      daysBeforeDue: reminderRules.daysBeforeDue,
      recipientUsername: users.username,
      recipientEmail: users.email,
    })
    .from(bills)
    .innerJoin(billMembers, eq(bills.id, billMembers.billId))
    .innerJoin(reminderRules, eq(billMembers.billId, reminderRules.billId))
    .innerJoin(users, eq(users.id, billMembers.userId))
    .where(
      sql`
      ${bills.isPaid} = false AND (
        (${bills.recurrence} = 'once' AND 
          ${bills.dueDate}::date - ${reminderRules.daysBeforeDue} * INTERVAL '1 day' = CURRENT_DATE)
        OR
        (${bills.recurrence} = 'monthly' AND 
          (DATE_TRUNC('month', CURRENT_DATE) + (${bills.dueDayOfMonth} - 1) * INTERVAL '1 day')::date 
          - ${reminderRules.daysBeforeDue} * INTERVAL '1 day' = CURRENT_DATE)
        OR
        (${bills.recurrence} = 'yearly' AND 
          MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::int, ${bills.dueMonth}, ${bills.dueDayOfMonth})::date
          - ${reminderRules.daysBeforeDue} * INTERVAL '1 day' = CURRENT_DATE)
      )
      `
    )
  return result;
}