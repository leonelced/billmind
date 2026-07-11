import "dotenv/config";


type JWTConfig = {
  defaultDuration: number;
  refreshDuration: number;
  secret: string;
  issuer: string;
  isProduction: boolean;
  refreshTokenPath: string;
}


export const config: JWTConfig = {
  defaultDuration: 60 * 15, // access token: 15 minutes
  refreshDuration: 60 * 60 * 24 * 30 * 1000, // refresh token: 30 days in milliseconds,
  secret: envOrThrow("JWT_SECRET"),
  issuer: "billmind", 
  isProduction: process.env.NODE_ENV === "production",
  refreshTokenPath: "/api/auth",// only include this cookie on requests starting with /api/auth/... 
}
// refreshDuration: ms added to Date.now() which returns the 
// current date and time represented as a number in milliseconds


function envOrThrow(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}