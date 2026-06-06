import { type NewBill } from "../../db/schema.js";
import { getBill } from "../../db/queries/bills.js";
import { 
  BadRequestError, 
  NotFoundError, 
  UserForbiddenError
} from "./errors.js";


export type BillParameters = {
  name: string;
  recurrence: "once" | "monthly" | "yearly";
  amount?: number;
  dueDate?: string;        // for once
  dueDayOfMonth?: number;  // for monthly and yearly
  dueMonth?: number;       // for yearly
  isPaid?: boolean
}


export type UpdateBill = Omit<NewBill, "ownerId" | "id" | "createdAt">


export function validateBillParams(params: BillParameters) {
  if (typeof params.name !== "string" || params.name.trim() === ""){
    throw new BadRequestError("Missing required name field");
  } 

  if (!["once", "monthly", "yearly"].includes(params.recurrence)) {
    throw new BadRequestError("Missing or incorrect recurrence field");
  }

  if (params.recurrence === "once") {
    if (typeof params.dueDate !== "string" || params.dueDate.trim() === "") {
      throw new BadRequestError("dueDate is required for one time bills");
    }
    if (params.dueDayOfMonth !== undefined || params.dueMonth !== undefined) {
      throw new BadRequestError("once bills must not include dueDayOfMonth or dueMonth");
    }
  }

  if (["monthly", "yearly"].includes(params.recurrence)) {
    if (
        params.dueDayOfMonth === undefined ||
        !Number.isInteger(params.dueDayOfMonth) ||
        params.dueDayOfMonth < 1 ||
        params.dueDayOfMonth > 31
      ) {
      throw new BadRequestError("Incorrect day of month for monthly/yearly bills");
    }
  }

  if (params.recurrence === "monthly") {
    if (params.dueDate !== undefined || params.dueMonth !== undefined) {
      throw new BadRequestError("monthly bills must not include dueDate or dueMonth");
    }
  }

  if (params.recurrence === "yearly") {
    if (
      params.dueMonth === undefined || 
      !Number.isInteger(params.dueMonth) ||
      params.dueMonth < 1 || 
      params.dueMonth > 12
    ) {
      throw new BadRequestError("Incorrect month for yearly bills");
    }
    if (params.dueDate !== undefined) {
      throw new BadRequestError("yearly bills must not include dueDate");
    }
  }
}


export async function verifyBillOwnership(userId: string, billId: string) {
  const bill = await getBill(billId);
  if (!bill) {
    throw new NotFoundError(`Bill with billId: ${billId} not found`);
  }
  if (bill.ownerId !== userId) {
    throw new UserForbiddenError("User not authorized");
  }
}