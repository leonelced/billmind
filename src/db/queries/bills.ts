import { db } from "../client.js";
import { eq } from "drizzle-orm";
import { users, bills, billMembers, reminderRules } from "../schema.js";
import type { NewBill, NewBillMember, NewReminderRule } from "../schema.js";


export async function createBill(newBill: NewBill) {
  const [result] = await db.insert(bills).values(newBill).returning();
  if (!result) throw new Error("Could not create bill");
  await db.insert(billMembers).values({ billId: result.id, userId: newBill.ownerId });
  return result;
}

export async function getBill(billId: string) {
  const [result] = await db.select().from(bills).where(eq(bills.id, billId));
  return result;
}

export async function getBillsByUser(userId: string) {
  const [result] = await db.select().from(bills).where(eq(bills.ownerId, userId));
  return result;
}

export async function addBillMember(billMember: NewBillMember) {
  const [result] = await db.insert(billMembers).values(billMember).returning();
  return result;
}

export async function getBillsByMember(userId: string) {
  const result = await db
    .select({
      id: bills.id,
      ownerId: bills.ownerId,
      name: bills.name,
      amount: bills.amount,
      dueDate: bills.dueDate,
      recurrence: bills.recurrence,
      isPaid: bills.isPaid,
      createdAt: bills.createdAt
    })
    .from(bills)
    .innerJoin(billMembers, eq(bills.id, billMembers.billId))
    .where(eq(billMembers.userId, userId));
  return result;
}

export async function addReminderRule(reminderRule: NewReminderRule) {
  const [result] = await db.insert(reminderRules).values(reminderRule).returning();
  return result;
}

export async function getBillWithRelations(billId: string) {
  const rows = await db
    .select()
    .from(bills)
    .leftJoin(billMembers, eq(bills.id, billMembers.billId))
    .leftJoin(reminderRules, eq(bills.id, reminderRules.billId))
    .leftJoin(users, eq(users.id, billMembers.userId))
    .where(eq(bills.id, billId));

  if (rows.length == 0) return null;
  const bill = rows[0]?.bills;

  const membersMap = new Map();
  const rulesMap = new Map();

  for (const row of rows) {
    if (row.bill_members) {
      membersMap.set(
        row.bill_members.userId, 
        { 
          userId: row.bill_members.userId, 
          userName: row.users?.username,
          email: row.users?.email
        }
      );
    }
    if (row.reminder_rules) {
      rulesMap.set(
        row.reminder_rules.id, 
        { 
          id: row.reminder_rules.id,
          daysBeforeDue: row.reminder_rules.daysBeforeDue
        }
      );
    }
  }
  return {
    bill,
    members: Array.from(membersMap.values()),
    rules: Array.from(rulesMap.values())
  };
}