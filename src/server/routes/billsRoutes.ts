import { Router } from "express";
import { handlerBillsCreate } from "../api/bills.js";


const router = Router();


router.post("/", async (req, res, next) => {
  Promise.resolve(handlerBillsCreate(req, res)).catch(next);
})


export default router;