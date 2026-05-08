import type { Request, Response } from "express";
import type { NewUser } from "../../db/schema.js";
import { createUser } from "../../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import argon2 from "argon2";


export async function handleRegister(req: Request, res: Response) {
  type parameters = {
    username: string;
    email: string;
    password: string;
  }

  const params: parameters = req.body;
  if (!params.username || !params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const passwordHash = await argon2.hash(params.password);

  const newUser: NewUser = {
    username : params.username,
    email : params.email,
    passwordHash : passwordHash
  };

  const user = await createUser(newUser);  
  if (!user) {
    throw new Error(`User ${params.username} was not created.`);
  }
  console.log(`The user ${user.username} was created successfully!`);

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email
  });
}