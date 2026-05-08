import { Router } from "express";
import { handleRegister } from "./users.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    await handleRegister(req, res);
  }catch (err) {
    next(err); // Pass the error to the errorMiddleware
  }
});


export default router;