// import { type Filter, ObjectId, type Db } from "mongodb";
// import jwt from "jsonwebtoken";
// import type {
//   Category,
//   CategoryOld,
//   CategoryResponse,
//   CustomRequest,
//   CustomRequestTodo,
//   Decode,
//   Login,
//   SignupType,
//   TodoOld,
//   TodoResponse,
//   Todos,
//   User,
//   UserOld,
//   UserUpdate,
// } from "./types/custom.d.ts";
// import { findOne, insertOne, updateOne } from "./dbMethods.ts";
// import Hapi from "@hapi/hapi";
// import bcrypt from "bcrypt";
// import Boom from "@hapi/boom";

// export const categoryModels = {
//   // categoryFetch: async (database: Db ): Promise<CategoryResponse> => {
//   //   const db: Db = database;
//   // },
//   categoryFetch: async (request: CustomRequest): Promise<CategoryResponse> => {
//     const db: Db = request.mongo.db;
//     const doc = await findOne<UserUpdate>({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//       },
//       whatToShow: ["categories.category", "categories._id"],
//     });
//     return doc?.categories?.map((c: CategoryOld) => ({
//       _id: c._id,
//       category: c.category,
//     }));
//   },
//   categoryInsert: async (
//     request: CustomRequest,
//     h: Hapi.ResponseToolkit
//   ): Promise<CategoryResponse> => {
//     const db: Db = request.mongo.db;
//     const payload = request.payload as { category: string };
//     const newCategory = { _id: new ObjectId(), category: payload.category, todos: [] };
//     await updateOne({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//       },
//       whatToDo: {
//         $push: { categories: newCategory },
//       },
//     });
//     // const doc = await findOne<UserUpdate>({
//     //   db: db,
//     //   dbCollection: "users",
//     //   filter: {
//     //     email: request.auth.credentials.email,
//     //     "categories.category": payload.category,
//     //   },
//     //   whatToShow: ["categories.$"],
//     // });

//     // if (doc !== null && doc.categories?.length) {
//     return newCategory;
//     // } else {
//     //   return h.response("No document matching credentials found");
//     // }
//   },
// };

// export const todosModels = {
//   todosDelete: async (request: CustomRequest): Promise<number> => {
//     const { objid, category } = request.params;
//     const id = new ObjectId(String(objid));
//     const db: Db = request.mongo.db;
//     console.log("id", id);
//     console.log("category", category);
//     console.log("email", request.auth.credentials.email);
//     const status = await updateOne({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//         "categories.category": category,
//       } as Filter<User>,
//       whatToDo: { $pull: { "categories.$[outer].todos": { _id: id } } },
//       arrayFilters: { arrayFilters: [{ "outer.category": category }] },
//     });
//     console.log(status);
//     return status.modifiedCount;
//   },
//   todosEdit: async (request: CustomRequest, h: Hapi.ResponseToolkit): Promise<TodoResponse> => {
//     // const { objid } = request.params;
//     // const id = new ObjectId(String(objid));
//     const { objid, category } = request.params;
//     const db: Db = request.mongo.db;
//     const id = new ObjectId(String(objid));
//     await updateOne({
//       db: db,
//       dbCollection: "users",
//       filter: { email: request.auth.credentials.email, "categories.category": category },
//       whatToDo: { $pull: { "categories.$[outer].todos": { _id: id } } },
//       arrayFilters: { arrayFilters: [{ "outer.category": category }] },
//     });
//     const payload = request.payload as { todonote: string; category: string };
//     const newTodo = { _id: new ObjectId(), todonote: payload.todonote };
//     await updateOne({
//       db: db,
//       dbCollection: "users",
//       filter: { email: request.auth.credentials.email, "categories.category": payload.category },
//       whatToDo: {
//         $push: {
//           "categories.$.todos": newTodo,
//         },
//       },
//     });
//     // const doc = await findOne<UserUpdate>({
//     //   db: db,
//     //   dbCollection: "users",
//     //   filter: {
//     //     email: request.auth.credentials.email,
//     //     "categories.category": payload.category,
//     //     "categories.todos._id": newTodo._id,
//     //   },
//     // });
//     // if (doc !== null && doc.categories?.length) {
//     //   console.log("0", doc);
//     //   let insertId = doc.categories.filter((n: Category) => n.category === payload.category);

//     //   let ab = insertId[0].todos.filter((n: Todos) => n._id === newTodo._id);

//     return { ...newTodo, category: payload.category };
//     // } else {
//     //   return h.response("No document matching credentials found");
//     // }
//   },
//   todosShare: async (request: CustomRequest): Promise<undefined> => {
//     // const { objid } = request.params;
//     // const id = new ObjectId(String(objid));
//     const { objid } = request.params;
//     const db: Db = request.mongo.db;
//     const id = new ObjectId(String(objid));
//     // await updateOne({
//     //   db: db,
//     //   dbCollection: "users",
//     //   filter: { email: request.auth.credentials.email, "categories.category": category },
//     //   projections: { $pull: { "categories.$[outer].todos": { _id: id } } },
//     //   arrayFilters: { arrayFilters: [{ "outer.category": category }] },
//     // });
//     const payload = request.payload as { todonote: string; email: string };
//     // await updateOne({
//     //   db: db,
//     //   dbCollection: "users",
//     //   filter: { email: request.auth.credentials.email, "categories.category": payload.category },

//     // });
//     await updateOne({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//         // "categories.todos._id": id,
//       },
//       whatToDo: {
//         $addToSet: { "categories.$[].todos.$[todo].sharedwith": payload.email },
//       },
//       arrayFilters: { arrayFilters: [{ "todo._id": id }] },
//     });
//     await updateOne({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//         // "categories.todos._id": id,
//       },
//       whatToDo: {
//         $set: { "categories.$[].todos.$[todo].todonote": payload.todonote },
//       },
//       arrayFilters: { arrayFilters: [{ "todo._id": id }] },
//     });
//   },
//   todosInsert: async (request: CustomRequest, h: Hapi.ResponseToolkit): Promise<TodoResponse> => {
//     const payload = request.payload as { todonote: string; category: string };
//     const newTodo = { _id: new ObjectId(), todonote: payload.todonote };
//     const db: Db = request.mongo.db;
//     await updateOne({
//       db: db,
//       dbCollection: "users",
//       filter: { email: request.auth.credentials.email, "categories.category": payload.category },
//       whatToDo: {
//         $push: {
//           "categories.$.todos": newTodo,
//         },
//       },
//     });
//     const doc = await findOne<UserUpdate>({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//         "categories.category": payload.category,
//         "categories.todos._id": newTodo._id,
//       },
//     });
//     if (doc !== null && doc.categories?.length) {
//       let insertId = doc.categories.filter((n: Category) => n.category === payload.category);

//       let ab = insertId[0].todos.filter((n: Todos) => n._id === newTodo._id);
//       return { ...ab[0], category: payload.category };
//     } else {
//       return h.response("No document matching credentials found");
//     }
//   },
//   allTodosFetch: async (request: CustomRequest, h: Hapi.ResponseToolkit): Promise<TodoResponse> => {
//     const db: Db = request.mongo.db;
//     const doc = await findOne<UserUpdate>({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//       },
//       whatToShow: ["categories.todos", "categories.category"],
//     });
//     if (doc !== null && doc.categories?.length) {
//       let newTodosMain: TodoOld[] = [];
//       for (const i of doc.categories) {
//         // const todos = i.todos;
//         // console.log(todos);

//         const newTodos: TodoOld[] = i.todos.map((td: Todos): TodoOld => {
//           return { ...td, category: i.category };
//         });

//         newTodosMain = [...newTodosMain, ...newTodos];
//       }

//       return newTodosMain;
//     } else {
//       return h.response("Error: No document matching credentials found");
//     }
//   },
//   categoryTodosFetch: async (
//     request: CustomRequestTodo,
//     h: Hapi.ResponseToolkit
//   ): Promise<TodoResponse> => {
//     const { categories } = request.params;
//     const db: Db = request.mongo.db;

//     const doc = await <UserUpdate>({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//         "categories.category": categories,
//       },
//       whatToShow: ["categories.$"],
//     });
//     if (doc !== null && doc.categories?.length) {
//       const obj: Category[] = doc.categories.filter(function (i) {
//         return i.category === categories;
//       });
//       const todos = obj[0].todos;
//       console.log(todos);

//       const newTodos = todos.map((td: Todos): TodoOld => {
//         return { ...td, category: categories };
//       });
//       // console.log("good query output");
//       return newTodos;
//     } else {
//       // if (doc == null) {
//       //   console.log("doc is null");
//       // } else {
//       //   if (doc?.categories == null) {
//       //     console.log("categories is null");
//       //   }
//       // }
//       console.log("got it");
//       return h.response("No document matching credentials found");
//     }
//   },
//   // sharedTodosFetchServices: async (
//   //   request: CustomRequest,
//   //   h: Hapi.ResponseToolkit
//   // ): Promise<TodoResponse> => {
//   //   const db: Db = request.mongo.db;
//   //   const doc = await aggregate<UserUpdate>({
//   //     db: db,
//   //     dbCollection: "users",
//   //     pipeline: [
//   //       {
//   //         $unwind: "$categories",
//   //       },
//   //       {
//   //         $unwind: "$categories.todos",
//   //       },
//   //       {
//   //         $match: {
//   //           "categories.todos.sharedwith": request.auth.credentials.email,
//   //         },
//   //       },
//   //       {
//   //         $project: {
//   //           _id: 0,
//   //           email: "$email",
//   //           todo: "$categories.todos",
//   //           category: "$categories.category",
//   //         },
//   //       },
//   //     ],
//   //   });
//   //   // console.log("DOC: " + JSON.stringify(doc, null, 2));
//   //   // && doc.todo !== undefined
//   //   if (doc !== null) {
//   //     let newTodosMain: TodoOld[] = [];
//   //     // console.log("DOC: " + doc.todo);
//   //     for (const i of doc) {
//   //       const todos = { _id: i.todo._id, todonote: i.todo.todonote, category: i.category };
//   //       // console.log(todos);
//   //       newTodosMain.push(todos);
//   //       // const newTodos = todos.map((td: Todos): TodoOld => {
//   //       //   return { ...td, category: "shared-todos" };
//   //       // });

//   //       // newTodosMain = [...newTodosMain, ...newTodos];
//   //     }

//   //     return newTodosMain;
//   //   } else {
//   //     return h.response("Error: No document matching credentials found");
//   //   }
//   // },
// };

// export const loginModels = {
//   signup: (request: CustomRequest): UserOld => {
//     const db: Db = request.mongo.db;
//     const payload = request.payload as {
//       name: string;
//       email: string;
//       password: string;
//     };
//     const saltRounds = 10;
//     let a = {} as {
//       name: string;
//       email: string;
//       password: string | object;
//     };
//     let status: SignupType = {} as SignupType;
//     bcrypt.hash(payload.password, saltRounds, async function (err, hashedPassword) {
//       a = { ...payload, password: hashedPassword };
//       status = await insertOne({
//         db: db,
//         dbCollection: "users",
//         payloadToInsert: a,
//       });
//       console.log("Inserted:", status.insertedId);
//     });
//     return {
//       name: payload.name,
//       email: payload.email,
//     };
//   },
//   login: async (request: CustomRequest): Promise<Login> => {
//     const db: Db = request.mongo.db;
//     const payload = request.payload as {
//       email: string;
//       password: string;
//     };
//     let credentials: Decode = {} as Decode;
//     let isValid: boolean = false;
//     let token: string = "";

//     const founduserinfo: User | null = await findOne<User>({
//       db: db,
//       dbCollection: "users",
//       filter: { email: payload.email },
//     });
//     if (typeof payload.password === "string" && typeof founduserinfo?.password === "string") {
//       isValid = await bcrypt.compare(payload.password, founduserinfo.password);

//       if (isValid === true) {
//         credentials = {
//           name: founduserinfo.name,
//           email: founduserinfo.email,
//         };
//         console.log("login successful", founduserinfo);
//         token = jwt.sign(credentials, "JWT_SECRET", { expiresIn: 60 * 5 }); // Token expires in 5 mins
//         console.log(token);
//       } else {
//         return Boom.unauthorized("invalid password", "basic");
//       }
//       return { isValid, credentials, token };
//     } else {
//       throw new Error("Invalid password data provided");
//     }
//   },
// };
