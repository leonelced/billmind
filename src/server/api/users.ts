import type { Request, Response } from "express";
import type { NewUser, User } from "../../db/schema.js";
import { createUser, updateUser } from "../../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "./auth.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../../config.js";


export type UserResponse = Omit<User, "passwordHash">


export async function handlerUsersCreate(req: Request, res: Response) {
  type parameters = {
    username: string;
    email: string;
    password: string;
  }

  const params: parameters = req.body;
  if (!params.username || !params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const passwordHash = await hashPassword(params.password);

  const newUser: NewUser = {
    username : params.username,
    email : params.email,
    passwordHash
  };

  const user = await createUser(newUser);  
  if (!user) {
    throw new Error(`User ${params.username} was not created.`);
  }
  console.log(`The user ${user.username} was created successfully!`);

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email, 
    createdAt: user.createdAt
  } satisfies UserResponse);
}


export async function handlerUsersUpdate(req: Request, res: Response) { // TODO: test ********************************
  type parameters = {
    username: string;
    email: string;
    password: string;
  }

  const accessToken = getBearerToken(req); 
  const userId = validateJWT(accessToken, config.secret); // TODO: replace with middleware

  const params: parameters = req.body;
  if (!params.username || !params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const passwordHash = await hashPassword(params.password);

  const user = await updateUser(userId, params.username, params.email, passwordHash);
  if (!user) {
    throw new Error("Could not update user");
  }
  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email, 
    createdAt: user.createdAt
  } satisfies UserResponse);
}