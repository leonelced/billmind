import type { Request, Response } from "express";
import type { BillParameters, UpdateBill } from "./helpers.js";
import type { NewBill, NewBillMember, NewReminderRule } from "../../db/schema.js";
import { validateBillParams, verifyBillAccess, verifyBillOwnership } from "./helpers.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { getUserByEmail } from "../../db/queries/users.js";
import { 
  createBill, 
  addBillMember, 
  addReminderRule, 
  getBillsByMember,  
  updateBill,
  deleteBill, 
} from "../../db/queries/bills.js";


export async function handlerBillsCreate(req: Request, res: Response) {
  const { userId } = req;
  const params: BillParameters = req.body;
  validateBillParams(params);

  const newBill: NewBill = {
    ownerId : userId,
    name: params.name,
    recurrence: params.recurrence,
    amount: params.amount ? String(params.amount) : null,
    dueDate: params.dueDate ? new Date(`${params.dueDate}T00:00:00`) : null,
    dueDayOfMonth: params.dueDayOfMonth ? params.dueDayOfMonth : null,
    dueMonth: params.dueMonth ? params.dueMonth : null
  }
  const bill = await createBill(newBill);
  if (!bill) {
    throw new Error("Could not create bill");
  }
  res.status(201).json(bill);
}


export async function handlerBillMembersAdd(req: Request<{ billId: string }>, res: Response) {
  const { userId } = req;
  const { billId } = req.params;
  const newBillMemberEmail = req.body.email;

  await verifyBillOwnership(userId, billId);
  if (!newBillMemberEmail) {
    throw new BadRequestError("Missing Required Field");
  }

  // look up the user (new member)
  const userFound = await getUserByEmail(newBillMemberEmail);
  if (!userFound) {
    throw new NotFoundError(`User with email ${newBillMemberEmail} does not exists`);
  }

  // add user to bill
  const billMember = await addBillMember({
    billId: billId,
    userId: userFound.id
  } satisfies NewBillMember);

  if (!billMember) {
    throw new Error("Could not create bill member");
  }
  res.status(201).json(billMember);
}


export async function handlerBillRemindersAdd(req: Request<{ billId: string }>, res: Response) {
  const { userId } = req;
  const { billId } = req.params;
  const { daysBeforeDue } = req.body;
  
  await verifyBillOwnership(userId, billId);
  if (typeof daysBeforeDue !== "number" || daysBeforeDue < 0) {
    throw new BadRequestError("daysBeforeDue must be a non-negative number");
  }

  const reminderRule = await addReminderRule({
    billId,
    daysBeforeDue,
  } satisfies NewReminderRule);

  if (!reminderRule) {
    throw new Error("Could not create reminder rule");
  }
  res.status(201).json(reminderRule);
}


export async function handlerMemberBillsGet(req: Request, res: Response) {
  const { userId } = req;
  const bills = await getBillsByMember(userId);
  res.status(200).json(bills);
}


export async function handlerBillGet(req: Request<{ billId: string}>, res: Response) {
  const { userId } = req;
  const { billId } = req.params;
  const bill = await verifyBillAccess(userId, billId);
  res.status(200).json(bill);
}


export async function handlerBillsDelete(req: Request<{ billId: string}>, res: Response) {
  const { userId } = req;
  const { billId } = req.params;
  await verifyBillOwnership(userId, billId);

  const deleted = await deleteBill(billId);
  if (!deleted) {
    throw new Error(`Failed to delete bill with billId: ${billId}`);
  }
  res.status(204).send();
}


export async function handlerBillsUpdate(req: Request<{ billId: string}>, res: Response) {
  const { userId } = req;
  const { billId } = req.params;
  await verifyBillOwnership(userId, billId);
  const params: BillParameters = req.body;
  validateBillParams(params);

  const billUpdate: UpdateBill = {
    name: params.name,
    recurrence: params.recurrence,
    amount: params.amount ? String(params.amount) : null,
    dueDate: params.dueDate ? new Date(`${params.dueDate}T00:00:00`) : null,
    dueDayOfMonth: params.dueDayOfMonth ? params.dueDayOfMonth : null,
    dueMonth: params.dueMonth ? params.dueMonth : null,
    isPaid: params.isPaid
  };
  const billUpdated = await updateBill(billId, billUpdate);
  if (!billUpdated) {
    throw new Error("Could not update bill");
  }
  res.status(200).json(billUpdated);
}