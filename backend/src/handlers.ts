import Path from "path";
import Hapi from "@hapi/hapi";
import { dirname } from "path";
import { fileURLToPath } from "url";
import type { CategoryResponse, TodoResponse, UserOld } from "./types/custom.d.ts";
import { handlerFunctionsServices } from "./services.ts";
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
      return await handlerFunctionsServices.allTodosFetchServices(request, h);
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
      return await handlerFunctionsServices.categoryTodosFetchServices(request, h);
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
      return await handlerFunctionsServices.categoryFetchServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  categoryInsert: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<CategoryResponse> => {
    try {
      return await handlerFunctionsServices.categoryInsertServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  signup: (request: Hapi.Request): UserOld => {
    return handlerFunctionsServices.signupServices(request);
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  login: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      return await handlerFunctionsServices.loginServices(request);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosInsert: async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<TodoResponse> => {
    try {
      return await handlerFunctionsServices.todosInsertServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosEdit: async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<TodoResponse> => {
    // const { objid } = request.params;
    // const id = new ObjectId(String(objid));
    try {
      return await handlerFunctionsServices.todosEditServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosDelete: async (request: Hapi.Request): Promise<number> => {
    return handlerFunctionsServices.todosDelete(request);
  },
};
