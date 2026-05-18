export type BillReminderEvent = {
  billId: string;
  billName: string;
  amount?: string | null;
  dueDate: Date;
  daysBeforeDue: number;
  recipientUsername: string;
  recipientEmail: string;
};