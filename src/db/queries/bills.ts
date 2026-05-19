import { db } from "../client.js";
import { eq } from "drizzle-orm";
import { bills, billMembers, reminderRules} from "../schema.js";
import type { NewBill, NewBillMember, NewReminderRule } from "../schema.js";


export async function createBill(newBill: NewBill) {
  const [result] = await db.insert(bills).values(newBill).returning();
  return result;
}

export async function getBill(billId: string) {
  const [result] = await db.select().from(bills).where(eq(bills.id, billId));
  return result;
}

export async function addBillMember(billMember: NewBillMember) {
  const [result] = await db.insert(billMembers).values(billMember).returning();
  return result;
}


export async function addReminderRule(reminderRule: NewReminderRule) {
  const [result] = await db.insert(reminderRules).values(reminderRule).returning();
  return result;
}