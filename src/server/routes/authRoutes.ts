import { Router } from "express";
import { handlerLogin } from "../api/login.js";
import { handlerRefresh, handlerRevoke } from "../api/refresh.js";


const router = Router();


router.post("/login", async (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});

router.post("/refresh", async (req, res, next) => {
  Promise.resolve(handlerRefresh(req, res)).catch(next);
});

router.post("/revoke", async (req, res, next) => {
  Promise.resolve(handlerRevoke(req, res)).catch(next);
});

export default router;