import Path from "path";
import type { Request, ResponseToolkit } from "@hapi/hapi";
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
  todosShare: async (request: Request, h: ResponseToolkit): Promise<TodoResponse> => {
    // const { objid } = request.params;
    // const id = new ObjectId(String(objid));
    try {
      await handlerFunctionsServices.todosShareServices(request);
      return null;
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  allTodosFetch: async (request: Request, h: ResponseToolkit): Promise<TodoResponse> => {
    try {
      return await handlerFunctionsServices.allTodosFetchServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  sharedTodosFetch: async (request: Request, h: ResponseToolkit): Promise<TodoResponse> => {
    try {
      return await handlerFunctionsServices.sharedTodosFetchServices(request, h);
    } catch (err) {
      console.error(err);
      var error = (err as Error).message;
      return h.response("sharedTodosFetch Error: " + error).code(500);
    }
  },
  categoryTodosFetch: async (request: Request, h: ResponseToolkit): Promise<TodoResponse> => {
    try {
      return await handlerFunctionsServices.categoryTodosFetchServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  categoryFetch: async (request: Request, h: ResponseToolkit): Promise<CategoryResponse> => {
    try {
      return await handlerFunctionsServices.categoryFetchServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  categoryInsert: async (request: Request, h: ResponseToolkit): Promise<CategoryResponse> => {
    try {
      return await handlerFunctionsServices.categoryInsertServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  signup: (request: Request): UserOld => {
    return handlerFunctionsServices.signupServices(request);
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  login: async (request: Request, h: ResponseToolkit) => {
    try {
      return await handlerFunctionsServices.loginServices(request);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosInsert: async (request: Request, h: ResponseToolkit): Promise<TodoResponse> => {
    try {
      return await handlerFunctionsServices.todosInsertServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosEdit: async (request: Request, h: ResponseToolkit): Promise<TodoResponse> => {
    // const { objid } = request.params;
    // const id = new ObjectId(String(objid));
    try {
      return await handlerFunctionsServices.todosEditServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosSharedEdit: async (request: Request, h: ResponseToolkit): Promise<TodoResponse> => {
    // const { objid } = request.params;
    // const id = new ObjectId(String(objid));
    try {
      return await handlerFunctionsServices.todosSharedEditServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosDelete: async (request: Request): Promise<number> => {
    return handlerFunctionsServices.todosDelete(request);
  },
};
