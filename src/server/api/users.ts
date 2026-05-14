import type { Request, Response } from "express";
import type { NewUser, User } from "../../db/schema.js";
import { createUser } from "../../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "./auth.js";


export type UserResponse = Omit<User, "passwordHash">


export async function handlerRegister(req: Request, res: Response) {
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