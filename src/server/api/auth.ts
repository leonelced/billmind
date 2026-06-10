import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import { type JwtPayload } from "jsonwebtoken";
import { type Request } from "express";
import { UserNotAuthenticatedError, BadRequestError } from "./errors.js";


// Hash Password --------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}


export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  if (!password) return false;
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}


// Access Token ---------------------------------------------------------------------------

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">


export function makeJWT(userId: string, expiresIn: number, secret: string): string {
  const issuedAt = Math.floor(Date.now() / 1000) // in seconds
  const expiresAt = issuedAt + expiresIn;
  const payload: payload = {
    iss: config.issuer, // issuer of the token
    sub: userId, // subject of the token
    iat: issuedAt,
    exp: expiresAt
  } satisfies payload;
  const token = jwt.sign(payload, secret, {algorithm: "HS256"})
  return token;
}


export function validateJWT(token: string, secret: string): string {
  let decoded: payload;
  try {
    decoded = jwt.verify(token, secret) as JwtPayload;
  } catch (e) {
    throw new UserNotAuthenticatedError("Invalid token");
  }
  if (decoded.iss !== config.issuer) {
    throw new UserNotAuthenticatedError("Invalid issuer");
  }
  if (!decoded.sub) {
    throw new UserNotAuthenticatedError("No user ID in token");
  }
  const userId = decoded.sub;
  return userId;
}


export function getBearerToken(req: Request): string {
  // Authorization: Bearer <token>
  const authHeader = req.get("Authorization");
  if (!authHeader) { // Expected format: "Bearer TOKEN_STRING"
    throw new UserNotAuthenticatedError("Missing authorization header");
  }
  const authHeaderParts = authHeader.split(" ");
  if (authHeaderParts.length < 2 || authHeaderParts[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header");
  }
  const token = authHeaderParts[1]!;
  return token;
}


// Refresh Token --------------------------------------------------------------------------

// Generate a random 512-bit (64-bytes x 8 bits) encoded string
export function makeRefreshToken() { // ~86 chars
  return crypto.randomBytes(64).toString("base64url");
}

// Hex is always 64 chars for SHA-256
export function hashRefreshToken(refreshToken: string) {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
} 
