import { db } from "../client.js";
import { type NewBill, bills } from "../schema.js";

export async function createBill(newBill: NewBill) {
  const [result] = await db.insert(bills).values(newBill).returning();
  return result;
}

