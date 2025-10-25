import { handlerFunctions } from "./handlers.ts";
import Joi from "joi";
import type { Request, ResponseToolkit, RouteDefMethods, Lifecycle } from "@hapi/hapi";
export const routes = [
  {
    method: "GET" as RouteDefMethods,
    path: "/assets/{param*}",
    handler: handlerFunctions.assets,
  },
  {
    method: "GET" as RouteDefMethods,
    path: "/{param*}",
    handler: handlerFunctions.params,
  },

  {
    method: "GET" as RouteDefMethods,
    path: "/list/all/todos",
    options: {
      auth: "jwt2",
    },
    handler: handlerFunctions.allTodosFetch,
  },
  {
    method: "GET" as RouteDefMethods,
    path: "/list/shared-todos/todos",
    options: {
      auth: "jwt2",
    },
    handler: handlerFunctions.sharedTodosFetch,
  },
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
    handler: handlerFunctions.categoryTodosFetch,
  },
  {
    method: "GET" as RouteDefMethods,
    path: "/list/categories",
    options: {
      auth: "jwt2",
    },
    handler: handlerFunctions.categoryFetch,
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
    handler: handlerFunctions.categoryInsert,
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
    handler: handlerFunctions.signup,
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
    handler: handlerFunctions.login,
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
    handler: handlerFunctions.todosInsert,
  },
  {
    method: "PUT" as RouteDefMethods,
    path: "/todos/share/{objid}",
    options: {
      auth: "jwt2",
      validate: {
        payload: Joi.object({
          todonote: Joi.string().required(),
          email: Joi.string().required(),
        }),
        params: Joi.object({
          objid: Joi.string().required(),
        }),
      },
    },
    handler: handlerFunctions.todosShare,
  },
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
    handler: handlerFunctions.todosEdit,
  },
  {
    method: "PUT" as RouteDefMethods,
    path: "/todos/{objid}/shared-todos",
    options: {
      auth: "jwt2",
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
    handler: handlerFunctions.todosSharedEdit,
  },
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
    handler: handlerFunctions.todosDelete,
  },
];
