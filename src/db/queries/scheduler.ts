import { db } from "../client.js";
import { sql } from "drizzle-orm";
import { bills } from "../schema.js";

export async function resetPaidBills() {
  const result = await db
    .update(bills)
    .set({ isPaid: false })
    .where(sql`
      ${bills.isPaid} = true AND (
        (${bills.recurrence} = 'monthly' AND
          (DATE_TRUNC('month', CURRENT_DATE) + (${bills.dueDayOfMonth} - 1) * INTERVAL '1 day')::date
          - 15 * INTERVAL '1 day' = CURRENT_DATE)
        OR
        (${bills.recurrence} = 'yearly' AND
          MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::int, ${bills.dueMonth}, ${bills.dueDayOfMonth})::date
          - 60 * INTERVAL '1 day' = CURRENT_DATE)
      )
    `)
    .returning();
  return result;
}