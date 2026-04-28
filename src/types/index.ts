export type User = {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
};

export type Bill = {
  id: number;
  ownerId: number;
  name: string;
  amount: number;
  dueDate: Date;
  recurrence: "weekly" | "monthly" | "yearly" | "once";
  isPaid: boolean;
};

export type BillMember = {
  billId: number;
  userId: number;
};

export type ReminderRule = {
  id: number;
  billId: number;
  daysBeforeDue: number;
};

export type BillReminderEvent = {
  billId: number;
  billName: string;
  amount: number;
  dueDate: Date;
  recipientEmail: string;
  recipientUsername: string;
  daysUntilDue: number;
};