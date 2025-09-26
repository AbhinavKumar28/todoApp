import Path from "path";
import Hapi from "@hapi/hapi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dirname } from "path";
import { ObjectId } from "mongodb";
import * as Boom from "@hapi/boom";
import { fileURLToPath } from "url";
import type {
  CategoryOld,
  CategoryResponse,
  Decode,
  SignupType,
  TodoOld,
  TodoResponse,
  User,
  UserOld,
} from "./types/custom.d.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const handlerFunctions = {
  assets: {
    directory: {
      path: Path.join(__dirname, "../../dist/assets/"),
      index: ["index.html"],
    },
  },
  params: {
    directory: {
      path: Path.join(__dirname, "../../dist"),
      index: ["index.html"],
    },
  },

  allTodosFetch: async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<TodoResponse> => {
    try {
      const todos = (await request.mongo.db
        .collection("todoapp")
        .find({})
        .toArray()) as TodoResponse;
      return todos;
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  categoryTodosFetch: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<TodoResponse> => {
    try {
      const { categories } = request.params;
      const todos = (await request.mongo.db
        .collection("todoapp")
        .find({ category: categories })
        .toArray()) as TodoResponse;
      console.log(todos);
      return todos;
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  categoryFetch: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<CategoryResponse> => {
    try {
      const categories = (await request.mongo.db
        .collection("category")
        .find({})
        .toArray()) as CategoryResponse;
      console.log(categories);
      return categories;
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  categoryInsert: async (request: Hapi.Request): Promise<CategoryOld> => {
    const payload = request.payload as { category: string };
    const status = await request.mongo.db.collection("category").insertOne(payload);
    console.log("Inserted:", status.insertedId);
    return {
      _id: status.insertedId,
      category: payload.category,
    };
  },
  signup: (request: Hapi.Request): UserOld => {
    const payload = request.payload as {
      name: string;
      email: string;
      password: string;
    };
    const saltRounds = 10;
    let a = {} as {
      name: string;
      email: string;
      password: string | object;
    };
    let status: SignupType = {} as SignupType;
    bcrypt.hash(payload.password, saltRounds, async function (err, hashedPassword) {
      a = { ...payload, password: hashedPassword };
      status = await request.mongo.db.collection("users").insertOne(a);
      console.log("Inserted:", status.insertedId);
    });
    return {
      _id: status.insertedId,
      name: payload.name,
      email: payload.email,
      password: payload.password,
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  login: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const payload = request.payload as {
      email: string;
      password: string;
    };
    let credentials: Decode = {} as Decode;
    let isValid: boolean = false;
    let token: string = "";
    try {
      const founduserinfo: User[] = (await request.mongo.db
        .collection("users")
        .find({ email: payload.email })
        .toArray()) as User[];
      isValid = await bcrypt.compare(payload.password, founduserinfo[0].password);
      if (isValid === true) {
        credentials = {
          name: founduserinfo[0].name,
          email: founduserinfo[0].email,
        };
        console.log("login successful", founduserinfo);
        token = jwt.sign(credentials, "JWT_SECRET", { expiresIn: 60 * 5 }); // Token expires in 1 hour
        console.log(token);
      } else {
        return Boom.unauthorized("invalid password", "basic");
      }
      return { isValid, credentials, token };
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosInsert: async (request: Hapi.Request): Promise<TodoOld> => {
    const payload = request.payload as { todonote: string; category: string };
    const status = await request.mongo.db.collection("todoapp").insertOne(payload);
    console.log("Inserted:", status.insertedId);
    return {
      _id: status.insertedId,
      todonote: payload.todonote,
      category: payload.category,
    };
  },
  todosEdit: async (request: Hapi.Request): Promise<number> => {
    const { objid } = request.params;
    const id = new ObjectId(String(objid));
    const payload = request.payload as { todonote: string; category: string };
    const status = await request.mongo.db
      .collection("todoapp")
      .updateOne({ _id: id }, { $set: payload });
    return status.matchedCount;
  },
  todosDelete: async (request: Hapi.Request): Promise<number> => {
    const { objid } = request.params;
    const id = new ObjectId(String(objid));
    // const payload = request.payload;
    const status = await request.mongo.db.collection("todoapp").deleteOne({ _id: id });
    return status.deletedCount;
  },
};
