import Hapi from "@hapi/hapi";
import { ObjectId } from "mongodb";
import type { Db } from "mongodb";
import type { CategoryResponse, CustomRequest } from "../types/custom.d.ts";
import { findOne, updateOne } from "../dbMethods.ts";
export const categoryServices = {
  categoryFetchServices: async (
    request: CustomRequest,
    h: Hapi.ResponseToolkit
  ): Promise<CategoryResponse> => {
    const db: Db = request.mongo.db;
    const doc = await findOne({
      db: db,
      dbCollection: "users",
      filter: {
        email: request.auth.credentials.email,
      },
      whatToShow: { projection: { "categories.category": 1, "categories._id": 1 } },
    });
    if (doc !== null) {
      return doc.categories;
    } else {
      return h.response("No document matching credentials found");
    }
  },
  categoryInsertServices: async (
    request: CustomRequest,
    h: Hapi.ResponseToolkit
  ): Promise<CategoryResponse> => {
    const db: Db = request.mongo.db;
    const payload = request.payload as { category: string };
    await updateOne({
      db: db,
      dbCollection: "users",
      filter: {
        email: request.auth.credentials.email,
      },
      whatToDo: {
        $push: { categories: { _id: new ObjectId(), category: payload.category } },
      },
    });
    const doc = await findOne({
      db: db,
      dbCollection: "users",
      filter: {
        email: request.auth.credentials.email,
        "categories.category": payload.category,
      },
      whatToShow: { projection: { "categories.$": 1 } },
    });

    if (doc !== null) {
      return doc.categories[0];
    } else {
      return h.response("No document matching credentials found");
    }
  },
};
