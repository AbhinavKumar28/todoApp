import type { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { MongoAdapter } from "../adapters/mongodbAdapter.ts";
import { UserModel } from "../models/user.ts";
import type { CustomRequest } from "../types/custom.d.ts";
import Boom from "@hapi/boom";
import { LoginService } from "../services/loginServices.ts";

export const userHandler = {
  login: async (request: CustomRequest, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const db = new MongoAdapter(request.mongo.db);
      const model = new UserModel(db);
      const service = new LoginService(model);

      const payload = request.payload as { email: string; password: string };
      const result = await service.login(payload.email, payload.password);

      return h.response(result).code(200);
    } catch (err) {
      if (Boom.isBoom(err)) {
        throw err;
      }

      // if (err.isBoom) return err;
      console.error("Login error:", err);
      return h.response({ message: "Internal server error" }).code(500);
    }
  },
  signup: async (request: CustomRequest, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const db = new MongoAdapter(request.mongo.db);
      const model = new UserModel(db);
      const service = new LoginService(model);
      const result = await service.signup(
        request.payload as {
          name: string;
          email: string;
          password: string;
        }
      );
      return h.response(result).code(201);
    } catch (err) {
      if (Boom.isBoom(err)) {
        throw err;
      }
      console.error("Login error:", err);
      return h.response({ error: err }).code(400);
    }
  },
};
