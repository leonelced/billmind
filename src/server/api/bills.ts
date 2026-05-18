import type { Request, Response } from "express";
import type { NewBill, NewBillMember, NewReminderRule } from "../../db/schema.js";
import { addBillMember, createBill, addReminderRule } from "../../db/queries/bills.js";
import { BadRequestError } from "./errors.js";


export async function handlerBillsCreate(req: Request, res: Response) {
  type parameters = {
    name: string;
    dueDate: string;
    recurrence: string;
    amount: number | undefined;
    isPaid: boolean | undefined;
  }

  const params: parameters = req.body;
  if (!params.name || !params.dueDate || !params.recurrence) {
    throw new BadRequestError("Missing Required Field");
  }

  const userId = validateJWT()

  const newBill: NewBill = {
    ownerId : userId,
    name: params.name,
    dueDate: new Date(params.dueDate),
    recurrence: params.recurrence, 
    amount: params.amount ? String(params.amount) : null,
    isPaid: params.isPaid
  }

  const bill = await createBill(newBill);
  if (!bill) {
    throw new Error("Could not create bill");
  }

  res.status(201).json(bill);
}


// Temp function **********************
export function validateJWT() {
  return String(process.env.TEST_USER_ID);
}


// billMembers Table -------------------------------------

export async function handlerBillMembersAdd(req: Request, res: Response) {
  const newBillMember: NewBillMember = {
    billId: req.params.billId as string,
    userId: req.body.userId
  };

  if (!newBillMember.billId || !newBillMember.userId) {
    throw new BadRequestError("Missing Required Field");
  }

  const billMember = await addBillMember(newBillMember);
  if (!billMember) {
    throw new Error("Could not create bill member");
  }

  res.status(201).json(billMember);
}


export async function handlerBillRemindersAdd(req: Request, res: Response) {
  const newReminderRule: NewReminderRule = {
    billId: req.params.billId as string,
    daysBeforeDue: req.body.daysBeforeDue
  };

  if (!newReminderRule.billId || newReminderRule.daysBeforeDue == null) {
    throw new BadRequestError("Missing Required Field");
  }  

  const reminderRule = await addReminderRule(newReminderRule);
  if (!reminderRule) {
    throw new Error("Could not create reminder rule");
  }

  res.status(201).json(reminderRule);
}