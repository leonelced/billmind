import type { Request, Response } from "express";
import { getUserByEmail } from "../../db/queries/users.js";
import { UserNotAuthenticatedError, BadRequestError } from "./errors.js";
import { checkPasswordHash, hashRefreshToken, makeJWT, makeRefreshToken } from "./auth.js";
import { config } from "../../config.js";
import { saveRefreshToken } from "../../db/queries/refresh.js";
import type { LoginResponse } from "../../types/index.js";


export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  }

  const params: parameters = req.body;
  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const user = await getUserByEmail(params.email);
  if (!user) {
    throw new UserNotAuthenticatedError("Invalid username or password");
  }

  const matching = await checkPasswordHash(params.password, user.passwordHash);
  if (!matching) {
    throw new UserNotAuthenticatedError("Invalid username or password");
  }
  
  const accessToken = makeJWT(user.id, config.defaultDuration, config.secret);

  const refreshToken = makeRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const saved = await saveRefreshToken(user.id, tokenHash);
  if (!saved) {
    throw new UserNotAuthenticatedError("Could not save refresh token");
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    path: config.refreshTokenPath,
  });

  res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    token: accessToken,
  } satisfies LoginResponse);
}

