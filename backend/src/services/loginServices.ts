import { UserModel } from "../models/user.ts";
import type { Login, User } from "../types/custom.d.ts";
import bcrypt from "bcrypt";
import Boom from "@hapi/boom";
import jwt from "jsonwebtoken";
export class LoginService {
  private userModel: UserModel;
  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }
  async signup(payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ name: string | undefined; email: string | undefined }> {
    const existing: User | null = await this.userModel.findByEmailWithProjection(payload.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const hashedPassword: string = await bcrypt.hash(payload.password, 10);

    const user: User = {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      categories: [],
    };

    const result = await this.userModel.insertUser(user);
    console.log(result);
    return { name: user.name, email: user.email };
  }
  async login(email: string, password: string): Promise<Login> {
    const foundUser = await this.userModel.findByEmailWithProjection(email);

    if (!foundUser || typeof foundUser.password !== "string") {
      throw Boom.unauthorized("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid) {
      throw Boom.unauthorized("Invalid password", "basic");
    }

    const credentials = {
      name: foundUser.name,
      email: foundUser.email,
    };

    const token = jwt.sign(credentials, "JWT_SECRET", { expiresIn: 60 * 5 });

    return { isValid, credentials, token };
  }
}
