import { MongoAdapter } from "../adapters/mongodbAdapter.ts";
import { UserModel } from "../models/user.ts";
import type { CustomRequest, CustomRequestTodo } from "../types/custom.d.ts";
import type { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { TodoService } from "../services/todoServices.ts";

export const todoHandler = {
  todosDelete: async (request: CustomRequest, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const dbClient = new MongoAdapter(request.mongo.db);
      const userModel = new UserModel(dbClient);
      const todoService = new TodoService(userModel);

      const { objid, category } = request.params;
      const email = request.auth.credentials.email;

      const modifiedCount = await todoService.deleteTodo(email, category, objid);
      if (modifiedCount === undefined) {
        return h.response({ message: "No todo deleted" });
      } else if (modifiedCount > 0) {
        return h.response({ deleted: modifiedCount }).code(200);
      } else {
        return h.response({ message: "No todo deleted" }).code(404);
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
      return h.response({ message: "Internal Server Error" }).code(500);
    }
  },

  todosEdit: async (request: CustomRequest, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const dbClient = new MongoAdapter(request.mongo.db);
      const userModel = new UserModel(dbClient);
      const todoService = new TodoService(userModel);

      const { objid, category } = request.params;
      const { todonote } = request.payload as { todonote: string };

      const email = request.auth.credentials.email;

      const updatedTodo = await todoService.editTodo(email, category, objid, todonote);

      return h.response(updatedTodo).code(200);
    } catch (err) {
      console.error("Error editing todo:", err);
      return h.response({ message: "Internal Server Error" }).code(500);
    }
  },
  todosInsert: async (request: CustomRequest, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const dbClient = new MongoAdapter(request.mongo.db);
      const userModel = new UserModel(dbClient);
      const todoService = new TodoService(userModel);

      const { todonote, category } = request.payload as { todonote: string; category: string };
      const email = request.auth.credentials.email;

      const insertedTodo = await todoService.addTodo(email, category, todonote);

      return h.response(insertedTodo).code(201);
    } catch (err) {
      console.error("Error inserting todo:", err);
      return h.response({ message: "Internal Server Error" }).code(500);
    }
  },
  allTodosFetch: async (request: CustomRequest, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const dbClient = new MongoAdapter(request.mongo.db);
      const userModel = new UserModel(dbClient);
      const todoService = new TodoService(userModel);

      const email = request.auth.credentials.email;
      const todos = await todoService.getAllTodos(email);

      return h.response(todos).code(200);
    } catch (err) {
      console.error("Error fetching todos:", err);
      return h.response({ message: "No document matching credentials found" }).code(404);
    }
  },
  categoryTodosFetch: async (
    request: CustomRequestTodo,
    h: ResponseToolkit
  ): Promise<ResponseObject> => {
    try {
      const dbClient = new MongoAdapter(request.mongo.db);
      const userModel = new UserModel(dbClient);
      const todoService = new TodoService(userModel);

      const email = request.auth.credentials.email;
      const { categories } = request.params;

      const todos = await todoService.getTodosByCategory(email, categories);
      return h.response(todos).code(200);
    } catch (err) {
      console.error("Error fetching category todos:", err);
      return h.response({ message: "No document matching credentials found" }).code(404);
    }
  },
};
