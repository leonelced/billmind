import { Router } from "express";
import { 
  handlerBillsCreate, 
  handlerBillMembersAdd, 
  handlerBillRemindersAdd, 
  handlerMemberBillsGet,
  handlerBillGet,
  handlerBillsDelete,
  handlerBillsUpdate
} from "../api/bills.js";


const router = Router();

// POST/PUT Requests

router.post("/", async (req, res, next) => {
  Promise.resolve(handlerBillsCreate(req, res)).catch(next);
});

router.post("/:billId/members", async (req, res, next) => {
  Promise.resolve(handlerBillMembersAdd(req, res)).catch(next);
});

router.post("/:billId/reminders", async (req, res, next) => {
  Promise.resolve(handlerBillRemindersAdd(req, res)).catch(next);
});

router.put("/:billId", async (req, res, next) => {
  Promise.resolve(handlerBillsUpdate(req, res)).catch(next);
});

// GET Requests

router.get("/", async (req, res, next) => { // per user
  Promise.resolve(handlerMemberBillsGet(req, res)).catch(next);
});

router.get("/:billId", async (req, res, next) => { // per user
  Promise.resolve(handlerBillGet(req, res)).catch(next);
});

// DELETE Requests

router.delete("/:billId", async (req, res, next) => {
  Promise.resolve(handlerBillsDelete(req, res)).catch(next);
});

export default router;