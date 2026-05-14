import type { Request, Response } from "express";
import type { NewBill } from "../../db/schema.js";
import { BadRequestError } from "./errors.js";
import { createBill } from "../../db/queries/bills.js";


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