import jwt from "jsonwebtoken";
import Hapi from "@hapi/hapi";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Inert from "@hapi/inert";
import "./types/hapiMongoPatch.ts";
import HapiMongoDB from "hapi-mongodb";
import { ObjectId } from "mongodb";
import JoiImport from "joi";

import joiObjectId from "joi-objectid";

import * as jwt2 from "hapi-auth-jwt2";
import bcrypt from "bcrypt";
import Path from "path";
import * as Boom from "@hapi/boom";
import dotenv from "dotenv";
import type { Decode, SignupType, User, Validate } from "./types/custom.d.ts";
joiObjectId(JoiImport);
dotenv.config();
const Joi = JoiImport;

export default Joi;

/// <reference path="./types/hapi-mongodb.d.ts" />

/// <reference path="./types/joi-objectid.d.ts" />
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const init = async (): Promise<null> => {
  const server = Hapi.server({
    port: 3005,
    host: "localhost",
    routes: {
      cors: {
        origin: ["http://localhost:3005"],
        headers: ["Accept", "Content-Type", "Authorization", "If-None-Match"],
        additionalHeaders: ["X-Requested-With"],
        exposedHeaders: ["Content-Disposition"],
        credentials: true,
      },
      files: {
        relativeTo: Path.join(__dirname, "../../dist"),
      },
    },
  });

  await server.register([
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      plugin: HapiMongoDB,
      options: {
        url: "mongodb://localhost:27017/latest_db",
        settings: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        decorate: true,
      },
    },
    {
      plugin: Inert,
      options: {},
    },
    {
      plugin: jwt2,
    },
  ]);
  server.auth.strategy("jwt2", "jwt", {
    key: "JWT_SECRET",
    validate,
  });

  server.route({
    method: "GET",
    path: "/assets/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "../../dist/assets/"),
        index: ["index.html"],
      },
    },
  });
  server.route({
    method: "*",
    path: "/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "../../dist"),
        index: ["index.html"],
      },
    },
  });

  server.route({
    method: "GET",
    path: "/list/all/todos",
    options: {
      auth: "jwt2",
    },
    handler: async (request, h) => {
      try {
        const todos = await request.mongo.db.collection("todoapp").find({}).toArray();
        return todos;
      } catch (err) {
        console.error(err);
        return h.response("Error fetching todos").code(500);
      }
    },
  });
  server.route({
    method: "GET",
    path: "/list/{categories}/todos",
    options: {
      auth: "jwt2",
      validate: {
        params: Joi.object({
          categories: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { categories } = request.params;
        const todos = await request.mongo.db
          .collection("todoapp")
          .find({ category: categories })
          .toArray();
        console.log(todos);
        return todos;
      } catch (err) {
        console.error(err);
        return h.response("Error fetching todos").code(500);
      }
    },
  });
  server.route({
    method: "GET",
    path: "/list/categories",
    options: {
      auth: "jwt2",
    },
    handler: async (request, h) => {
      try {
        const todos = await request.mongo.db.collection("category").find({}).toArray();
        console.log(todos);
        return todos;
      } catch (err) {
        console.error(err);
        return h.response("Error fetching todos").code(500);
      }
    },
  });
  server.route({
    method: "POST",
    path: "/categoriesInsert",
    options: {
      validate: {
        payload: Joi.object({
          category: Joi.string().required(),
        }),
      },
    },
    handler: async (request) => {
      const payload = request.payload as { category: string };
      const status = await request.mongo.db.collection("category").insertOne(payload);
      console.log("Inserted:", status.insertedId);
      return {
        _id: status.insertedId,
        category: payload.category,
      };
    },
  });
  server.route({
    method: "POST",
    path: "/signup",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
    },
    handler: (request) => {
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
  });
  server.route({
    method: "POST",
    path: "/login",
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
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
  });
  server.route({
    method: "POST",
    path: "/todosInsert",
    options: {
      validate: {
        payload: Joi.object({
          todonote: Joi.string().required(),
          category: Joi.string().required(),
        }),
      },
    },
    handler: async (request) => {
      const payload = request.payload as { todonote: string; category: string };
      const status = await request.mongo.db.collection("todoapp").insertOne(payload);
      console.log("Inserted:", status.insertedId);
      return {
        _id: status.insertedId,
        todonote: payload.todonote,
        category: payload.category,
      };
    },
  });
  server.route({
    method: "PUT",
    path: "/todos/{objid}",
    options: {
      validate: {
        payload: Joi.object({
          todonote: Joi.string().required(),
          category: Joi.string().required(),
        }),
        params: Joi.object({
          objid: Joi.string().required(),
        }),
      },
    },
    handler: async (request) => {
      const { objid } = request.params;
      const id = new ObjectId(String(objid));
      const payload = request.payload as { todonote: string; category: string };
      const status = await request.mongo.db
        .collection("todoapp")
        .updateOne({ _id: id }, { $set: payload });
      return status;
    },
  });
  server.route({
    method: "DELETE",
    path: "/todos/{objid}",
    options: {
      validate: {
        params: Joi.object({
          objid: Joi.string().required(),
        }),
      },
    },
    handler: async (request) => {
      const { objid } = request.params;
      const id = new ObjectId(String(objid));
      // const payload = request.payload;
      const status = await request.mongo.db.collection("todoapp").deleteOne({ _id: id });
      return status;
    },
  });
  await server.start();
  console.log("Server running on %s", server.info.uri);
  return null;
};
const validate = async function (decoded: Decode, request: Hapi.Request): Promise<Validate> {
  const founduserinfo = await request.mongo.db
    .collection("users")
    .find({ email: decoded.email })
    .toArray();
  if (founduserinfo.length === 0) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};
init().then(
  () => {
    console.log("Initialization successful.");
  },
  (error) => {
    console.error("Initialization failed:", error);
  }
);
