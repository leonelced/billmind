import type { Request, Response, NextFunction } from "express";
import { 
  BadRequestError,
  UserNotAuthenticatedError,
  UserForbiddenError,
  NotFoundError
} from "./errors.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../../config.js";


export function errorMiddleWare(err: Error, _: Request, res: Response, __: NextFunction) {
  let statusCode = 500;
  let message = "Something went wrong on our end";

  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UserNotAuthenticatedError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof UserForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }

  res.set("Content-Type", "application/json");
  res.status(statusCode).json({
    message
  });
}


export function requireAuth(req: Request, _: Response, next: NextFunction) {
  const token = getBearerToken(req);
  req.userId = validateJWT(token, config.secret);
  next();
}