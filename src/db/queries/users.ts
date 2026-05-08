import { db } from "../client.js";
import { type NewUser, users } from "../schema.js";

export async function createUser(newUser: NewUser) {
  const [result] = await db.insert(users).values(newUser).returning();
  return result;
}

