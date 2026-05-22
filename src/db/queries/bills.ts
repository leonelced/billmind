import { db } from "../client.js";
import { eq } from "drizzle-orm";
import { bills, billMembers, reminderRules } from "../schema.js";
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