/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Path from "path";
import Hapi from "@hapi/hapi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dirname } from "path";
import { ObjectId } from "mongodb";
import * as Boom from "@hapi/boom";
import { fileURLToPath } from "url";
import type {
  CategoryResponse,
  Decode,
  SignupType,
  TodoOld,
  TodoResponse,
  Todos,
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
      const doc = await request.mongo.db.collection("users").findOne(
        {
          email: request.auth.credentials.email,
        },
        { projection: { "categories.todos": 1, "categories.category": 1 } }
      );
      if (doc !== null) {
        let newTodosMain: TodoOld[] = [];
        for (const i of doc.categories) {
          const todos = i.todos;
          console.log(todos);

          const newTodos = todos.map((td: Todos): TodoOld => {
            return { ...td, category: i.category };
          });

          newTodosMain = [...newTodosMain, ...newTodos];
        }

        return newTodosMain;
      } else {
        return h.response("No document matching credentials found");
      }
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

      const doc = await request.mongo.db.collection("users").findOne(
        {
          email: request.auth.credentials.email,

          "categories.category": categories,
        },
        { projection: { "categories.$": 1 } }
      );

      if (doc !== null) {
        const todos = doc.categories[0].todos;
        console.log(todos);

        const newTodos = todos.map((td: Todos): TodoOld => {
          return { ...td, category: categories };
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return newTodos;
      } else {
        return h.response("No document matching credentials found");
      }
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
      const doc = await request.mongo.db.collection("users").findOne(
        {
          email: request.auth.credentials.email,
        },
        { projection: { "categories.category": 1, "categories._id": 1 } }
      );
      if (doc !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return doc.categories;
      } else {
        return h.response("No document matching credentials found");
      }
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  categoryInsert: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<CategoryResponse> => {
    const payload = request.payload as { category: string };

    const userCollection = request.mongo.db.collection("users") as any;
    try {
      await userCollection.updateOne(
        { email: request.auth.credentials.email },
        {
          $push: { categories: { _id: new ObjectId(), category: payload.category } },
        }
      );
      const doc = await request.mongo.db.collection("users").findOne(
        {
          email: request.auth.credentials.email,
          "categories.category": payload.category,
        },
        { projection: { "categories.$": 1 } }
      );

      if (doc !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return doc.categories[0];
      } else {
        return h.response("No document matching credentials found");
      }
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
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
      name: payload.name,
      email: payload.email,
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
  todosInsert: async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<TodoResponse> => {
    const payload = request.payload as { todonote: string; category: string };
    const newTodo = { _id: new ObjectId(), todonote: payload.todonote };
    try {
      await (request.mongo.db.collection("users") as any).updateOne(
        { email: request.auth.credentials.email, "categories.category": payload.category },
        {
          $push: {
            "categories.$.todos": newTodo,
          },
        }
      );
      const doc = await request.mongo.db.collection("users").findOne({
        email: request.auth.credentials.email,
        "categories.category": payload.category,
        "categories.todos._id": newTodo._id,
      });

      if (doc !== null) {
        let insertId = doc.categories.category.filter((n: any) => n.category === payload.category);

        let ab = insertId[0].todos.filter((n: any) => n._id === newTodo._id);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return { ...ab[0], category: payload.category };
      } else {
        return h.response("No document matching credentials found");
      }
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosEdit: async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<TodoResponse> => {
    // const { objid } = request.params;
    // const id = new ObjectId(String(objid));
    const { objid, category } = request.params;
    const id = new ObjectId(String(objid));
    await (request.mongo.db.collection("users") as any).updateOne(
      { email: request.auth.credentials.email, "categories.category": category },
      { $pull: { "categories.$[outer].todos": { _id: id } } },
      { arrayFilters: [{ "outer.category": category }] }
    );
    const payload = request.payload as { todonote: string; category: string };
    const newTodo = { _id: new ObjectId(), todonote: payload.todonote };
    try {
      await (request.mongo.db.collection("users") as any).updateOne(
        { email: request.auth.credentials.email, "categories.category": payload.category },
        {
          $push: {
            "categories.$.todos": newTodo,
          },
        }
      );
      const doc = await request.mongo.db.collection("users").findOne({
        email: request.auth.credentials.email,
        "categories.category": payload.category,
        "categories.todos._id": newTodo._id,
      });

      if (doc !== null) {
        let insertId = doc.categories.category.filter((n: any) => n.category === payload.category);

        let ab = insertId[0].todos.filter((n: any) => n._id === newTodo._id);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return { ...ab[0], category: payload.category };
      } else {
        return h.response("No document matching credentials found");
      }
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosDelete: async (request: Hapi.Request): Promise<number> => {
    const { objid, category } = request.params;
    const id = new ObjectId(String(objid));

    const status = await (request.mongo.db.collection("users") as any).updateOne(
      { email: request.auth.credentials.email, "categories.category": category },
      { $pull: { "categories.$[outer].todos": { _id: id } } },
      { arrayFilters: [{ "outer.category": category }] }
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return status.modifiedCount;
  },
};
