import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  numeric, 
  boolean, 
  unique, 
  integer,
  check,
  varchar
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;


export const bills = pgTable("bills", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  ownerId: uuid("owner_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: numeric("amount"),
  recurrence: text("recurrence").notNull(),
  dueDate: timestamp("due_date"), // for one time payments
  dueDayOfMonth: integer("due_day_of_month"), // used by monthly and yearly bills
  dueMonth: integer("due_month"), // for yearly bills
  isPaid: boolean("is_paid").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
},
  (table) => [
    check(
      "due_day_of_month",
      sql`${table.dueDayOfMonth} IS NULL OR (${table.dueDayOfMonth} >= 1 AND ${table.dueDayOfMonth} <= 31)`
    ),
    check(
      "due_month",
      sql`${table.dueMonth} IS NULL OR (${table.dueMonth} >= 1 AND ${table.dueMonth} <= 12)`
    )
  ]
);

export type Bill = typeof bills.$inferSelect;
export type NewBill = typeof bills.$inferInsert;


export const billMembers = pgTable("bill_members", {
  billId: uuid("bill_id").notNull()
    .references(() => bills.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull()
    .references(() => users.id, { onDelete: "cascade"})
},
(table) => [unique().on(table.billId, table.userId)]
);

export type BillMember = typeof billMembers.$inferSelect;
export type NewBillMember = typeof billMembers.$inferInsert;


export const reminderRules = pgTable("reminder_rules", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  billId: uuid("bill_id").notNull()
    .references(() => bills.id, { onDelete: "cascade"}),
  daysBeforeDue: integer("days_before_due").notNull()
});

export type ReminderRule = typeof reminderRules.$inferSelect;
export type NewReminderRule = typeof reminderRules.$inferInsert;


export const refreshTokens = pgTable("refresh_tokens", {
  tokenHash: varchar("token_hash", { length: 64 }).primaryKey(),
  userId: uuid("user_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"), // null if not revoked
});

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

