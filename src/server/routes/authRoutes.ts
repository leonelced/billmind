import { Router } from "express";
import { handlerLogin } from "../api/login.js";
import { handlerRegister } from "../api/users.js";


const router = Router();


router.post("/register", async (req, res, next) => {
  try {
    await handlerRegister(req, res);
  }catch (err) {
    next(err); // Pass the error to the errorMiddleware
  }
});

router.post("/login", async (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});


export default router;