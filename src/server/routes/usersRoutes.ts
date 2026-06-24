import { Router } from "express";
import { handlerUsersCreate } from "../api/users.js";
import { handlerUsersUpdate } from "../api/users.js";


const router = Router();


router.post("/register", async (req, res, next) => { // TODO: change to 'users' and fix frontend
  try {
    await handlerUsersCreate(req, res);
  } catch (err) {
    next(err); // Pass the error to the errorMiddleware
  }
});

router.put("/update", async (req, res, next) => { // TODO: change to 'users' too and move to new usersRoutes file
  Promise.resolve(handlerUsersUpdate(req, res).catch(next));
});

export default router;