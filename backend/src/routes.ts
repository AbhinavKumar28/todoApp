// import { handlerFunctions } from "./handlers.ts";
import Joi from "joi";
import type { Request, ResponseToolkit, RouteDefMethods, Lifecycle } from "@hapi/hapi";
import { staticFileServices } from "./services/staticFileServices.ts";
import { todoHandler } from "./handlers/todosHandler.ts";
import { categoryHandler } from "./handlers/categoryHandler.ts";
import { userHandler } from "./handlers/userHandler.ts";
export const routes = [
  {
    method: "GET" as RouteDefMethods,
    path: "/assets/{param*}",
    handler: staticFileServices.assets,
  },
  {
    method: "GET" as RouteDefMethods,
    path: "/{param*}",
    handler: staticFileServices.params,
  },

  {
    method: "GET" as RouteDefMethods,
    path: "/list/all/todos",
    options: {
      auth: "jwt2",
    },
    handler: todoHandler.allTodosFetch,
  },
  // {
  //   method: "GET" as RouteDefMethods,
  //   path: "/list/shared-todos/todos",
  //   options: {
  //     auth: "jwt2",
  //   },
  //   handler: handlerFunctions.sharedTodosFetch,
  // },
  {
    method: "GET" as RouteDefMethods,
    path: "/list/{categories}/todos",
    options: {
      auth: "jwt2",
      validate: {
        params: Joi.object({
          categories: Joi.string().required(),
        }),
      },
    },
    handler: todoHandler.categoryTodosFetch,
  },
  {
    method: "GET" as RouteDefMethods,
    path: "/list/categories",
    options: {
      auth: "jwt2",
    },
    handler: categoryHandler.categoryFetch,
  },
  {
    method: "POST" as RouteDefMethods,
    path: "/categoriesInsert",
    options: {
      auth: "jwt2",
      validate: {
        payload: Joi.object({
          category: Joi.string().invalid("shared-todos").required(),
        }),
        failAction: (request: Request, h: ResponseToolkit, err?: Error): Lifecycle.ReturnValue => {
          // throw err;
          throw err || new Error("Validation failed");
        },
      },
    },
    handler: categoryHandler.categoryInsert,
  },
  {
    method: "POST" as RouteDefMethods,
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
    handler: userHandler.signup,
  },
  {
    method: "POST" as RouteDefMethods,
    path: "/login",
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
    },
    handler: userHandler.login,
  },
  {
    method: "POST" as RouteDefMethods,
    path: "/todosInsert",
    options: {
      auth: "jwt2",
      validate: {
        payload: Joi.object({
          todonote: Joi.string().required(),
          category: Joi.string().required(),
        }),
      },
    },
    handler: todoHandler.todosInsert,
  },
  // {
  //   method: "PUT" as RouteDefMethods,
  //   path: "/todos/share/{objid}",
  //   options: {
  //     auth: "jwt2",
  //     validate: {
  //       payload: Joi.object({
  //         todonote: Joi.string().required(),
  //         email: Joi.string().required(),
  //       }),
  //       params: Joi.object({
  //         objid: Joi.string().required(),
  //       }),
  //     },
  //   },
  //   handler: handlerFunctions.todosShare,
  // },
  {
    method: "PUT" as RouteDefMethods,
    path: "/todos/{objid}/{category}",
    options: {
      auth: "jwt2",
      validate: {
        payload: Joi.object({
          todonote: Joi.string().required(),
          category: Joi.string().required(),
        }),
        params: Joi.object({
          objid: Joi.string().required(),
          category: Joi.string().required(),
        }),
      },
    },
    handler: todoHandler.todosEdit,
  },
  // {
  //   method: "PUT" as RouteDefMethods,
  //   path: "/todos/{objid}/shared-todos",
  //   options: {
  //     auth: "jwt2",
  //     validate: {
  //       payload: Joi.object({
  //         todonote: Joi.string().required(),
  //         category: Joi.string().required(),
  //       }),
  //       params: Joi.object({
  //         objid: Joi.string().required(),
  //       }),
  //     },
  //   },
  //   handler: handlerFunctions.todosSharedEdit,
  // },
  {
    method: "DELETE" as RouteDefMethods,
    path: "/todos/{objid}/{category}",
    options: {
      auth: "jwt2",
      validate: {
        params: Joi.object({
          objid: Joi.string().required(),
          category: Joi.string().required(),
        }),
      },
    },
    handler: todoHandler.todosDelete,
  },
];
