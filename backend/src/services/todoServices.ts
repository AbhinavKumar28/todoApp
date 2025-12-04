// import { todosModels } from "../models.ts";
// import type { CustomRequest, CustomRequestTodo, TodoResponse } from "../types/custom.d.ts";
// import Hapi from "@hapi/hapi";
// export const todoServices = {
//   todosDeleteServices: async (request: CustomRequest): Promise<number> => {
//     const doc = await todosModels.todosDelete(request);
//     console.log("Services ok", doc);
//     return doc;
//   },
//   todosEditServices: async (
//     request: CustomRequest,
//     h: Hapi.ResponseToolkit
//   ): Promise<TodoResponse> => {
//     const doc = await todosModels.todosEdit(request, h);
//     return doc;
//   },
//   todosShareServices: async (request: CustomRequest): Promise<undefined> => {
//     await todosModels.todosShare(request);
//   },
//   todosInsertServices: async (
//     request: CustomRequest,
//     h: Hapi.ResponseToolkit
//   ): Promise<TodoResponse> => {
//     const doc = await todosModels.todosInsert(request, h);
//     return doc;
//   },
//   allTodosFetchServices: async (
//     request: CustomRequest,
//     h: Hapi.ResponseToolkit
//   ): Promise<TodoResponse> => {
//     const doc = await todosModels.allTodosFetch(request, h);
//     return doc;
//   },
//   categoryTodosFetchServices: async (
//     request: CustomRequestTodo,
//     h: Hapi.ResponseToolkit
//   ): Promise<TodoResponse> => {
//     // console.log("Services ok");
//     const doc = await todosModels.categoryTodosFetch(request, h);
//     console.log(doc);
//     return doc;
//   },
// };

import { ObjectId } from "mongodb";
import { UserModel } from "../models/user.ts";
import type { Category, TodoOld, Todos } from "../types/custom.d.ts";
export class TodoService {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async deleteTodo(email: string, category: string, todoId: string): Promise<number | undefined> {
    const id = new ObjectId(todoId);
    const modifiedCount = await this.userModel.deleteTodoById(email, category, id);

    if (modifiedCount === 0) {
      console.warn("No todo deleted — may not exist or invalid category.");
    }

    return modifiedCount;
  }
  async editTodo(
    email: string,
    category: string,
    todoId: string,
    todonote: string
  ): Promise<TodoOld> {
    const id = new ObjectId(todoId);

    await this.userModel.deleteTodoById(email, category, id);

    const newTodo = { _id: new ObjectId(), todonote };

    await this.userModel.addTodoToCategory(email, category, newTodo);

    return { ...newTodo, category };
  }
  async addTodo(email: string, category: string, todonote: string): Promise<TodoOld> {
    const newTodo = { _id: new ObjectId(), todonote };

    await this.userModel.addTodoToCategory(email, category, newTodo);

    const doc = await this.userModel.findTodoById(email, category, newTodo._id);

    if (doc && doc.categories?.length) {
      const categoryObj = doc.categories[0];
      const todoObj = categoryObj?.todos.find((t: Todos) => t._id.equals(newTodo._id));
      if (todoObj !== undefined) {
        return { ...todoObj, category };
      } else {
        throw new Error("Unable to insert Todo!");
      }
    } else {
      throw new Error("Unable to insert Todo!");
    }
  }
  async getAllTodos(email: string): Promise<TodoOld[]> {
    const doc = await this.userModel.getTodosWithCategories(email);

    if (!doc || !doc.categories?.length) {
      throw new Error("No document matching credentials found");
    }

    let allTodos: TodoOld[] = [];

    for (const category of doc.categories) {
      const todos = category.todos.map((todo: Todos) => ({
        ...todo,
        category: category.category,
      }));

      allTodos = [...allTodos, ...todos];
    }

    return allTodos;
  }
  async getTodosByCategory(email: string, category: string): Promise<TodoOld[]> {
    const doc = await this.userModel.getTodosByCategory(email, category);

    if (!doc || !doc.categories?.length) {
      throw new Error("No document matching credentials found");
    }

    const categoryObj: Category = doc.categories[0];
    const todos = categoryObj.todos.map((td: Todos) => ({
      ...td,
      category: category,
    }));

    return todos;
  }
}
