export type BillReminderEvent = {
  billId: number;
  billName: string;
  amount?: number;
  dueDate: Date;
  recipientEmail: string;
  recipientUsername: string;
  daysUntilDue: number;
};