import "dotenv/config";


type JWTConfig = {
  defaultDuration: number;
  refreshDuration: number;
  secret: string;
  issuer: string;
}


export const config: JWTConfig = {
  defaultDuration: 60 ,// * 15 access token: 15 minutes
  // refreshDuration: 60 * 60 * 24 * 60 * 1000, // refresh token: 60 days in milliseconds,
  refreshDuration: 60 * 3 * 1000,
  secret: envOrThrow("JWT_SECRET"),
  issuer: "billmind"
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