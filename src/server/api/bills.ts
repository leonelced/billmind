import type { Request, Response } from "express";
import type { NewBill, NewBillMember, NewReminderRule } from "../../db/schema.js";
import { addBillMember, createBill, addReminderRule, getBill, getBillsByMember } from "../../db/queries/bills.js";
import { BadRequestError, NotFoundError, UserForbiddenError } from "./errors.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../../config.js";


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

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.secret);

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


export async function handlerBillMembersAdd(req: Request, res: Response) {
  const token = getBearerToken(req);
  const untrustedUserId = validateJWT(token, config.secret);
  const newBillMember: NewBillMember = {
    billId: req.params.billId as string,
    userId: req.body.userId
  };

  if (!newBillMember.billId || !newBillMember.userId) {
    throw new BadRequestError("Missing Required Field");
  }

  const bill = await getBill(newBillMember.billId);

  if (!bill) {
    throw new NotFoundError(`Bill with id: ${newBillMember.billId} not found`);
  }
  if (bill.ownerId !== untrustedUserId) {
    throw new UserForbiddenError("User forbidden");
  }

  const billMember = await addBillMember(newBillMember);
  if (!billMember) {
    throw new Error("Could not create bill member");
  }

  res.status(201).json(billMember);
}


export async function handlerBillRemindersAdd(req: Request, res: Response) {
  const token = getBearerToken(req);
  const untrustedUserId = validateJWT(token, config.secret);
  const newReminderRule: NewReminderRule = {
    billId: req.params.billId as string,
    daysBeforeDue: req.body.daysBeforeDue
  };

  if (!newReminderRule.billId || newReminderRule.daysBeforeDue == null) {
    throw new BadRequestError("Missing Required Field");
  }  

  const bill = await getBill(newReminderRule.billId);

  if (!bill) {
    throw new NotFoundError(`Bill with id: ${newReminderRule.billId} not found`);
  }
  if (bill.ownerId !== untrustedUserId) {
    throw new UserForbiddenError("User forbidden");
  }  

  const reminderRule = await addReminderRule(newReminderRule);
  if (!reminderRule) {
    throw new Error("Could not create reminder rule");
  }

  res.status(201).json(reminderRule);
}


export async function handlerMemberBillsGet(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.secret);
  const bills = await getBillsByMember(userId);
  res.status(200).json(bills);
}