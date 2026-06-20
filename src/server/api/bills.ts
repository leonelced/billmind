import type { Request, Response } from "express";
import type { BillParameters, UpdateBill } from "./helpers.js";
import type { NewBill, NewBillMember, NewReminderRule } from "../../db/schema.js";
import { BadRequestError, NotFoundError, UserForbiddenError } from "./errors.js";
import { validateBillParams, verifyBillOwnership } from "./helpers.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { getUserByEmail } from "../../db/queries/users.js";
import { config } from "../../config.js";
import { 
  createBill, 
  addBillMember, 
  addReminderRule, 
  getBillsByMember, 
  getBillWithRelations, 
  updateBill,
  deleteBill, 
} from "../../db/queries/bills.js";


export async function handlerBillsCreate(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.secret);
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
  const token = getBearerToken(req);
  const untrustedUserId = validateJWT(token, config.secret);
  const { billId } = req.params;
  const newBillMemberEmail = req.body.email;

  await verifyBillOwnership(untrustedUserId, billId);
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
  const token = getBearerToken(req);
  const untrustedUserId = validateJWT(token, config.secret);
  const { billId } = req.params;
  const { daysBeforeDue } = req.body;
  
  await verifyBillOwnership(untrustedUserId, billId);
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
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.secret);
  const bills = await getBillsByMember(userId);
  res.status(200).json(bills);
}


export async function handlerBillGet(req: Request<{ billId: string}>, res: Response) {
  const token = getBearerToken(req);
  validateJWT(token, config.secret);
  const { billId } = req.params;

  const bill = await getBillWithRelations(billId);
  if (!bill) {
    throw new NotFoundError(`Bill with id: ${billId} not found`);
  }
  res.status(200).json(bill);
}


export async function handlerBillsDelete(req: Request<{ billId: string}>, res: Response) {
  const token = getBearerToken(req);
  const untrustedUserId = validateJWT(token, config.secret);
  const { billId } = req.params;
  await verifyBillOwnership(untrustedUserId, billId);

  const deleted = await deleteBill(billId);
  if (!deleted) {
    throw new Error(`Failed to delete bill with billId: ${billId}`);
  }
  res.status(204).send();
}


export async function handlerBillsUpdate(req: Request<{ billId: string}>, res: Response) {
  const token = getBearerToken(req);
  const untrustedUserId = validateJWT(token, config.secret);
  const { billId } = req.params;
  await verifyBillOwnership(untrustedUserId, billId);
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