import type { Request, Response } from "express";
import { hashRefreshToken, makeJWT } from "./auth.js";
import { getUserFromTokenHash, revokeRefreshToken } from "../../db/queries/refresh.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { config } from "../../config.js";


export async function handlerRefresh(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new UserNotAuthenticatedError("Missing refresh token");
  }
  const tokenHash = hashRefreshToken(refreshToken);
  const user = await getUserFromTokenHash(tokenHash);
  if (!user) {
    throw new UserNotAuthenticatedError("Invalid refresh token");
  }
  const accessToken = makeJWT(
    user.id, 
    config.defaultDuration, 
    config.secret
  );
  res.status(200).json({
    token: accessToken
  })
}


export async function handlerRevoke(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new UserNotAuthenticatedError("Missing refresh token");
  }
  const tokenHash = hashRefreshToken(refreshToken);
  const revoked = await revokeRefreshToken(tokenHash);
  if (!revoked) {
    throw new Error("Could not revoke token");
  }
  res.clearCookie("refreshToken", { path: config.refreshTokenPath });
  res.status(204).send();
}