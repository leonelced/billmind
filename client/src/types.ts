export const RECURRENCE = {
  ONCE: "once",
  MONTHLY: "monthly",
  YEARLY: "yearly"
} as const;

export type Recurrence = typeof RECURRENCE[keyof typeof RECURRENCE];

export interface Bill {
  id: string,
  ownerId: string,
  name: string,
  recurrence: Recurrence;
  amount?: string,
  dueDate?: string,
  dueDayOfMonth?: number,
  dueMonth?: number,
  isPaid: boolean,
}

export interface Member {
  userId: string;
  userName: string;
  email: string;
}

export interface Rule {
  id: string;
  daysBeforeDue: number;
}

export interface BillDetails {
  bill: Bill;
  members: Member[];
  rules: Rule[];
}