import { MongoAdapter } from "../adapters/mongodbAdapter.ts";
import { UserModel } from "../models/user.ts";
import { CategoryService } from "../services/categoryServices.ts";
import type { CustomRequest } from "../types/custom.d.ts";
import type { ResponseObject, ResponseToolkit } from "@hapi/hapi";

export const categoryHandler = {
  categoryFetch: async (request: CustomRequest, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const dbClient = new MongoAdapter(request.mongo.db);
      const userModel = new UserModel(dbClient);
      const categoryService = new CategoryService(userModel);

      const email = request.auth.credentials.email;
      const categories = await categoryService.fetchCategories(email);

      return h.response(categories).code(200);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return h.response({ message: "Internal Server Error" }).code(500);
    }
  },
  categoryInsert: async (request: CustomRequest, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const dbClient = new MongoAdapter(request.mongo.db);
      const userModel = new UserModel(dbClient);
      const categoryService = new CategoryService(userModel);

      const { category } = request.payload as { category: string };
      const email = request.auth.credentials.email;

      const newCategory = await categoryService.insertCategory(email, category);
      return h.response(newCategory).code(201);
    } catch (error) {
      console.error("Error inserting category:", error);
      return h.response({ message: "Internal Server Error" }).code(500);
    }
  },
};
