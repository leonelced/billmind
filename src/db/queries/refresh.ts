import { db } from "../client.js";
import { config } from "../../config.js";
import { users, refreshTokens } from "../schema.js";
import { eq, and, isNull, gt } from "drizzle-orm";


export async function saveRefreshToken(userId: string, tokenHash: string): Promise<boolean> {
  const result = await db
    .insert(refreshTokens)
    .values({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + config.refreshDuration),
      revokedAt: null
    })
    .returning();
  return result.length > 0;
}


export async function getUserFromTokenHash(tokenHash: string) {
  const [result] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      createdAt: users.createdAt
    })
    .from(users)
    .innerJoin(refreshTokens,
      eq(users.id, refreshTokens.userId)
    )
    .where(
      and(
        eq(refreshTokens.tokenHash, tokenHash),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
    ));
  return result;
}


export async function revokeRefreshToken(tokenHash: string) {
  const [result] =  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .returning();
  return result;
}