import type { Request, Response } from "express";
import type { NewUser, User } from "../../db/schema.js";
import { createUser, deleteUser, getUserById, updateUser } from "../../db/queries/users.js";
import { BadRequestError, NotFoundError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, hashPassword } from "./auth.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../../config.js";
import { validatePassword } from "./helpers.js";


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

  validatePassword(params.password);

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

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email, 
    createdAt: user.createdAt
  } satisfies UserResponse);
}


export async function handlerUsersUpdate(req: Request, res: Response) {
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


export async function handlerUsersDelete(req: Request, res: Response) { // TODO: change to soft-delete
  type parameters = {
    password: string;
  }

  const accessToken = getBearerToken(req); 
  const userId = validateJWT(accessToken, config.secret);

  const params: parameters = req.body;
  if (!params.password) {
    throw new BadRequestError("Password confirmation required");
  }

  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const matching = await checkPasswordHash(params.password, user.passwordHash);
  if (!matching) {
    throw new UserNotAuthenticatedError("Incorrect password");
  }

  const deleted = await deleteUser(userId);
  if (!deleted) {
    throw new Error(`User ${userId} was not deleted.`);
  }
  
  res.status(204).send();
}