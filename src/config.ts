import { type JWTConfig } from "./types/index.js";
import "dotenv/config";


export const config: JWTConfig = {
  defaultDuration: 60 * 60, // 1 hour in seconds
  secret: envOrThrow("JWT_SECRET"),
  issuer: "billmind"
}

function envOrThrow(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}