import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  numeric, 
  boolean, 
  unique, 
  integer 
} from "drizzle-orm/pg-core";


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
  dueDate: timestamp("due_date").notNull(),
  recurrence: text("recurrence").notNull(),
  isPaid: boolean("is_paid").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

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


export const reminderRules = pgTable("reminder_rules", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  billId: uuid("bill_id").notNull()
    .references(() => bills.id, { onDelete: "cascade"}),
  daysBeforeDue: integer("days_before_due").notNull()
});

export type ReminderRule = typeof reminderRules.$inferSelect;
export type NewReminderRule = typeof reminderRules.$inferInsert;
