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
import { findOne, insertOne, updateOne } from "./models.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const handlerFunctionsServices = {
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

  allTodosFetchServices: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<TodoResponse> => {
    const doc = await findOne(
      request,
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
  },
  categoryTodosFetchServices: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<TodoResponse> => {
    const { categories } = request.params;
    const doc = await findOne(
      request,
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
  },
  categoryFetchServices: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<CategoryResponse> => {
    const doc = await findOne(
      request,
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
  },
  categoryInsertServices: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<CategoryResponse> => {
    const payload = request.payload as { category: string };
    await updateOne(
      request,
      {
        email: request.auth.credentials.email,
      },
      {
        $push: { categories: { _id: new ObjectId(), category: payload.category } },
      }
    );
    const doc = await findOne(
      request,
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
  },
  signupServices: (request: Hapi.Request): UserOld => {
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
      status = await insertOne(request, undefined, undefined, a);
      console.log("Inserted:", status.insertedId);
    });
    return {
      name: payload.name,
      email: payload.email,
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  loginServices: async (request: Hapi.Request) => {
    const payload = request.payload as {
      email: string;
      password: string;
    };
    let credentials: Decode = {} as Decode;
    let isValid: boolean = false;
    let token: string = "";

    const founduserinfo: User = await findOne(request, { email: payload.email });
    isValid = await bcrypt.compare(payload.password, founduserinfo.password);
    if (isValid === true) {
      credentials = {
        name: founduserinfo.name,
        email: founduserinfo.email,
      };
      console.log("login successful", founduserinfo);
      token = jwt.sign(credentials, "JWT_SECRET", { expiresIn: 60 * 5 }); // Token expires in 1 hour
      console.log(token);
    } else {
      return Boom.unauthorized("invalid password", "basic");
    }
    return { isValid, credentials, token };
  },
  todosInsertServices: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<TodoResponse> => {
    const payload = request.payload as { todonote: string; category: string };
    const newTodo = { _id: new ObjectId(), todonote: payload.todonote };
    await updateOne(
      request,
      { email: request.auth.credentials.email, "categories.category": payload.category },
      {
        $push: {
          "categories.$.todos": newTodo,
        },
      }
    );
    const doc = await findOne(request, {
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
  },
  todosEditServices: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<TodoResponse> => {
    // const { objid } = request.params;
    // const id = new ObjectId(String(objid));
    const { objid, category } = request.params;
    const id = new ObjectId(String(objid));
    await updateOne(
      request,
      { email: request.auth.credentials.email, "categories.category": category },
      { $pull: { "categories.$[outer].todos": { _id: id } } },
      undefined,
      { arrayFilters: [{ "outer.category": category }] }
    );
    const payload = request.payload as { todonote: string; category: string };
    const newTodo = { _id: new ObjectId(), todonote: payload.todonote };
    await updateOne(
      request,
      { email: request.auth.credentials.email, "categories.category": payload.category },
      {
        $push: {
          "categories.$.todos": newTodo,
        },
      }
    );
    const doc = await findOne(request, {
      email: request.auth.credentials.email,
      "categories.category": payload.category,
      "categories.todos._id": newTodo._id,
    });
    if (doc !== null) {
      console.log("0", doc);
      let insertId = doc.categories.filter((n: any) => n.category === payload.category);

      let ab = insertId[0].todos.filter((n: any) => n._id === newTodo._id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return { ...ab[0], category: payload.category };
    } else {
      return h.response("No document matching credentials found");
    }
  },
  todosDelete: async (request: Hapi.Request): Promise<number> => {
    const { objid, category } = request.params;
    const id = new ObjectId(String(objid));
    const status = await updateOne(
      request,
      { email: request.auth.credentials.email, "categories.category": category },
      { $pull: { "categories.$[outer].todos": { _id: id } } },
      undefined,
      { arrayFilters: [{ "outer.category": category }] }
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return status.modifiedCount;
  },
};
