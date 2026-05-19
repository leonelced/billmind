import { beforeAll, describe, expect, it } from "vitest";
import { makeJWT, validateJWT } from "./server/api/auth.js";
import { UserNotAuthenticatedError } from "./server/api/errors.js";


// ----------------------------------------------------- Test JWT Functions

describe("JWT Functions", async () => {
  const userId = "some-unique-user-id";
  const expiresIn = 3600;
  const secret = "secret";
  const wrongSecret = "wrong_secret";
  let validToken: string;

  beforeAll(() => {
    validToken = makeJWT(userId, expiresIn, secret);
  });

  it("should validate a valid token", async () => {
    const result = validateJWT(validToken, secret);
    expect(result).toBe(userId)
  });

  it("should throw an error for an invalid token string", async () => {
    expect(() => validateJWT("invalid_token_string", secret))
      .toThrow(UserNotAuthenticatedError,);
  });

  it("should throw an error when the token is signed with a wrong secret", async () => {
    expect(() => validateJWT(validToken, wrongSecret))
      .toThrow(UserNotAuthenticatedError,);
  });
})
