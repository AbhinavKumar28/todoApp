import Path from "path";
import type { ResponseToolkit } from "@hapi/hapi";
import { dirname } from "path";
import { fileURLToPath } from "url";
import type {
  CategoryResponse,
  CustomRequest,
  CustomRequestTodo,
  TodoResponse,
  UserOld,
} from "./types/custom.d.ts";
// import { handlerFunctionsServices } from "./services.ts";
import { loginServices } from "./services/loginServices.ts";
import { todoServices } from "./services/todoServices.ts";
import { categoryServices } from "./services/categoryServices.ts";
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
  todosShare: async (request: CustomRequest, h: ResponseToolkit): Promise<TodoResponse> => {
    // const { objid } = request.params;
    // const id = new ObjectId(String(objid));
    try {
      await todoServices.todosShareServices(request);
      return null;
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  allTodosFetch: async (request: CustomRequest, h: ResponseToolkit): Promise<TodoResponse> => {
    try {
      return await todoServices.allTodosFetchServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  // sharedTodosFetch: async (request: Request, h: ResponseToolkit): Promise<TodoResponse> => {
  //   try {
  //     return await handlerFunctionsServices.sharedTodosFetchServices(request, h);
  //   } catch (err) {
  //     console.error(err);
  //     var error = (err as Error).message;
  //     return h.response("sharedTodosFetch Error: " + error).code(500);
  //   }
  // },
  categoryTodosFetch: async (
    request: CustomRequestTodo,
    h: ResponseToolkit
  ): Promise<TodoResponse> => {
    try {
      // console.log("CategoryTodosFetch ok");
      return await todoServices.categoryTodosFetchServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  categoryFetch: async (request: CustomRequest, h: ResponseToolkit): Promise<CategoryResponse> => {
    try {
      return await categoryServices.categoryFetchServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  categoryInsert: async (request: CustomRequest, h: ResponseToolkit): Promise<CategoryResponse> => {
    try {
      return await categoryServices.categoryInsertServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  signup: (request: CustomRequest): UserOld => {
    return loginServices.signupServices(request);
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  login: async (request: CustomRequest, h: ResponseToolkit) => {
    try {
      return await loginServices.loginServices(request);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosInsert: async (request: CustomRequest, h: ResponseToolkit): Promise<TodoResponse> => {
    try {
      return await todoServices.todosInsertServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  todosEdit: async (request: CustomRequest, h: ResponseToolkit): Promise<TodoResponse> => {
    // const { objid } = request.params;
    // const id = new ObjectId(String(objid));
    try {
      return await todoServices.todosEditServices(request, h);
    } catch (err) {
      console.error(err);
      return h.response("Error fetching todos").code(500);
    }
  },
  // todosSharedEdit: async (request: Request, h: ResponseToolkit): Promise<TodoResponse> => {
  //   // const { objid } = request.params;
  //   // const id = new ObjectId(String(objid));
  //   try {
  //     return await handlerFunctionsServices.todosSharedEditServices(request, h);
  //   } catch (err) {
  //     console.error(err);
  //     return h.response("Error fetching todos").code(500);
  //   }
  // },
  todosDelete: async (request: CustomRequest): Promise<number> => {
    console.log("handler ok");
    return todoServices.todosDeleteServices(request);
  },
};
