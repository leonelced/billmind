import { type NewUser } from "../db/schema.js";


export type BillReminderEvent = {
  billId: string;
  billName: string;
  amount?: string;
  recurrence: "once" | "monthly" | "yearly";  
  dueDate?: Date;
  dueDayOfMonth?: number;
  dueMonth?: number;
  daysBeforeDue: number;
  recipientUsername: string;
  recipientEmail: string;
};


export type UserResponse = Omit<NewUser, "passwordHash">;

export type LoginResponse = UserResponse & { 
  token: string; // access token
};
