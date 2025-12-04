// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Path from "path";
// import Hapi from "@hapi/hapi";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { dirname } from "path";
// import { ObjectId } from "mongodb";
// import type { Db } from "mongodb";
// import * as Boom from "@hapi/boom";
// import { fileURLToPath } from "url";
// import type {
//   CategoryResponse,
//   CustomRequest,
//   Decode,
//   SignupType,
//   TodoOld,
//   TodoResponse,
//   Todos,
//   User,
//   UserOld,
// } from "./types/custom.d.ts";
// import { aggregate, findOne, insertOne, updateOne } from "./dbMethods.ts";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// export const handlerFunctionsServices = {
//   assets: {
//     directory: {
//       path: Path.join(__dirname, "../../dist/assets/"),
//       index: ["index.html"],
//     },
//   },
//   params: {
//     directory: {
//       path: Path.join(__dirname, "../../dist"),
//       index: ["index.html"],
//     },
//   },

//   allTodosFetchServices: async (
//     request: CustomRequest,
//     h: Hapi.ResponseToolkit
//   ): Promise<TodoResponse> => {
//     const db: Db = request.mongo.db;
//     const doc = await findOne({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//       },
//       whatToShow: { projection: { "categories.todos": 1, "categories.category": 1 } },
//     });
//     if (doc !== null) {
//       let newTodosMain: TodoOld[] = [];
//       for (const i of doc.categories) {
//         const todos = i.todos;
//         console.log(todos);

//         const newTodos = todos.map((td: Todos): TodoOld => {
//           return { ...td, category: i.category };
//         });

//         newTodosMain = [...newTodosMain, ...newTodos];
//       }

//       return newTodosMain;
//     } else {
//       return h.response("Error: No document matching credentials found");
//     }
//   },
//   sharedTodosFetchServices: async (
//     request: CustomRequest,
//     h: Hapi.ResponseToolkit
//   ): Promise<TodoResponse> => {
//     const db: Db = request.mongo.db;
//     const doc = await aggregate({
//       db: db,
//       dbCollection: "users",
//       pipeline: [
//         {
//           $unwind: "$categories",
//         },
//         {
//           $unwind: "$categories.todos",
//         },
//         {
//           $match: {
//             "categories.todos.sharedwith": request.auth.credentials.email,
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             email: "$email",
//             todo: "$categories.todos",
//             category: "$categories.category"
//           },
//         },
//       ],
//     });
//     // console.log("DOC: " + JSON.stringify(doc, null, 2));
//     // && doc.todo !== undefined
//     if (doc !== null) {
//       let newTodosMain: TodoOld[] = [];
//       // console.log("DOC: " + doc.todo);
//       for (const i of doc) {
//         const todos = { _id: i.todo._id, todonote: i.todo.todonote, category: i.category };
//         // console.log(todos);
//         newTodosMain.push(todos);
//         // const newTodos = todos.map((td: Todos): TodoOld => {
//         //   return { ...td, category: "shared-todos" };
//         // });

//         // newTodosMain = [...newTodosMain, ...newTodos];
//       }

//       return newTodosMain;
//     } else {
//       return h.response("Error: No document matching credentials found");
//     }
//   },
//   categoryTodosFetchServices: async (
//     request: CustomRequest,
//     h: Hapi.ResponseToolkit
//   ): Promise<TodoResponse> => {
//     const { categories } = request.params;
//     const db: Db = request.mongo.db;
//     const doc = await findOne({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,

//         "categories.category": categories,
//       },
//       whatToShow: { projection: { "categories.$": 1 } },
//     });
//     if (doc !== null) {
//       const todos = doc.categories[0].todos;
//       console.log(todos);

//       const newTodos = todos.map((td: Todos): TodoOld => {
//         return { ...td, category: categories };
//       });
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//       return newTodos;
//     } else {
//       return h.response("No document matching credentials found");
//     }
//   },
//   // categoryFetchServices: async (
//   //   request: CustomRequest,
//   //   h: Hapi.ResponseToolkit
//   // ): Promise<CategoryResponse> => {
//   //   const db: Db = request.mongo.db;
//   //   const doc = await findOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: {
//   //       email: request.auth.credentials.email,
//   //     },
//   //     whatToShow: { projection: { "categories.category": 1, "categories._id": 1 } },
//   //   });
//   //   if (doc !== null) {
//   //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   //     return doc.categories;
//   //   } else {
//   //     return h.response("No document matching credentials found");
//   //   }
//   // },
//   // categoryInsertServices: async (
//   //   request: CustomRequest,
//   //   h: Hapi.ResponseToolkit
//   // ): Promise<CategoryResponse> => {
//   //   const db: Db = request.mongo.db;
//   //   const payload = request.payload as { category: string };
//   //   await updateOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: {
//   //       email: request.auth.credentials.email,
//   //     },
//   //     whatToDo: {
//   //       $push: { categories: { _id: new ObjectId(), category: payload.category } },
//   //     },
//   //   });
//   //   const doc = await findOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: {
//   //       email: request.auth.credentials.email,
//   //       "categories.category": payload.category,
//   //     },
//   //     whatToShow: { projection: { "categories.$": 1 } },
//   //   });

//   //   if (doc !== null) {
//   //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   //     return doc.categories[0];
//   //   } else {
//   //     return h.response("No document matching credentials found");
//   //   }
//   // },
//   // signupServices: (request: CustomRequest): UserOld => {
//   //   const db: Db = request.mongo.db;
//   //   const payload = request.payload as {
//   //     name: string;
//   //     email: string;
//   //     password: string;
//   //   };
//   //   const saltRounds = 10;
//   //   let a = {} as {
//   //     name: string;
//   //     email: string;
//   //     password: string | object;
//   //   };
//   //   let status: SignupType = {} as SignupType;
//   //   bcrypt.hash(payload.password, saltRounds, async function (err, hashedPassword) {
//   //     a = { ...payload, password: hashedPassword };
//   //     status = await insertOne({
//   //       db: db,
//   //       dbCollection: "users",
//   //       payloadToInsert: a,
//   //     });
//   //     console.log("Inserted:", status.insertedId);
//   //   });
//   //   return {
//   //     name: payload.name,
//   //     email: payload.email,
//   //   };
//   // },
//   // // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
//   // loginServices: async (request: CustomRequest) => {
//   //   const db: Db = request.mongo.db;
//   //   const payload = request.payload as {
//   //     email: string;
//   //     password: string;
//   //   };
//   //   let credentials: Decode = {} as Decode;
//   //   let isValid: boolean = false;
//   //   let token: string = "";

//   //   const founduserinfo: User = await findOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: { email: payload.email },
//   //   });
//   //   isValid = await bcrypt.compare(payload.password, founduserinfo.password);
//   //   if (isValid === true) {
//   //     credentials = {
//   //       name: founduserinfo.name,
//   //       email: founduserinfo.email,
//   //     };
//   //     console.log("login successful", founduserinfo);
//   //     token = jwt.sign(credentials, "JWT_SECRET", { expiresIn: 60 * 5 }); // Token expires in 1 hour
//   //     console.log(token);
//   //   } else {
//   //     return Boom.unauthorized("invalid password", "basic");
//   //   }
//   //   return { isValid, credentials, token };
//   // },
//   // todosInsertServices: async (
//   //   request: CustomRequest,
//   //   h: Hapi.ResponseToolkit
//   // ): Promise<TodoResponse> => {
//   //   const payload = request.payload as { todonote: string; category: string };
//   //   const newTodo = { _id: new ObjectId(), todonote: payload.todonote };
//   //   const db: Db = request.mongo.db;
//   //   await updateOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: { email: request.auth.credentials.email, "categories.category": payload.category },
//   //     whatToDo: {
//   //       $push: {
//   //         "categories.$.todos": newTodo,
//   //       },
//   //     },
//   //   });
//   //   const doc = await findOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: {
//   //       email: request.auth.credentials.email,
//   //       "categories.category": payload.category,
//   //       "categories.todos._id": newTodo._id,
//   //     },
//   //   });
//   //   if (doc !== null) {
//   //     let insertId = doc.categories.category.filter((n: any) => n.category === payload.category);

//   //     let ab = insertId[0].todos.filter((n: any) => n._id === newTodo._id);
//   //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   //     return { ...ab[0], category: payload.category };
//   //   } else {
//   //     return h.response("No document matching credentials found");
//   //   }
//   // },
//   // todosShareServices: async (request: CustomRequest): Promise<undefined> => {
//   //   // const { objid } = request.params;
//   //   // const id = new ObjectId(String(objid));
//   //   const { objid } = request.params;
//   //   const db: Db = request.mongo.db;
//   //   const id = new ObjectId(String(objid));
//   //   // await updateOne({
//   //   //   db: db,
//   //   //   dbCollection: "users",
//   //   //   filter: { email: request.auth.credentials.email, "categories.category": category },
//   //   //   projections: { $pull: { "categories.$[outer].todos": { _id: id } } },
//   //   //   arrayFilters: { arrayFilters: [{ "outer.category": category }] },
//   //   // });
//   //   const payload = request.payload as { todonote: string; email: string };
//   //   // await updateOne({
//   //   //   db: db,
//   //   //   dbCollection: "users",
//   //   //   filter: { email: request.auth.credentials.email, "categories.category": payload.category },

//   //   // });
//   //   await updateOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: {
//   //       email: request.auth.credentials.email,
//   //       // "categories.todos._id": id,
//   //     },
//   //     whatToDo: {
//   //       $addToSet: { "categories.$[].todos.$[todo].sharedwith": payload.email },
//   //     },
//   //     arrayFilters: { arrayFilters: [{ "todo._id": id }] },
//   //   });
//   //   await updateOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: {
//   //       email: request.auth.credentials.email,
//   //       // "categories.todos._id": id,
//   //     },
//   //     whatToDo: {
//   //       $set: { "categories.$[].todos.$[todo].todonote": payload.todonote },
//   //     },
//   //     arrayFilters: { arrayFilters: [{ "todo._id": id }] },
//   //   });
//   // },
//   todosSharedEditServices: async (
//     request: CustomRequest,
//     h: Hapi.ResponseToolkit
//   ): Promise<TodoResponse> => {
//     // const { objid } = request.params;
//     // const id = new ObjectId(String(objid));
//     const { objid } = request.params;
//     const db: Db = request.mongo.db;
//     const id = new ObjectId(String(objid));
//     const doc = await aggregate({
//       db: db,
//       dbCollection: "users",
//       pipeline: [
//         {
//           $unwind: "$categories",
//         },
//         {
//           $unwind: "$categories.todos",
//         },
//         {
//           $match: {
//             "categories.todos.sharedwith": request.auth.credentials.email,
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             email: "$email",
//             todo: "$categories.todos",
//           },
//         },
//       ],
//     });

//     db.collection.aggregate([
//   {
//     $match: {
//       "categories.todos.id": "todo2"
//     }
//   },

//   {
//     $unwind: "$categories"
//   },

//   {
//     $unwind: "$categories.todos"
//   },

//   {
//     $match: {
//       "categories.todos.id": "todo2"
//     }
//   },

//   {
//     $project: {
//       _id: 0,
//       id: "$categories.todos.id",
//       todonote: "$categories.todos.todonote",
//       sharedwith: "$categories.todos.sharedwith"
//     }
//   }
// ])
//     await updateOne({
//       db: db,
//       dbCollection: "users",
//       filter: { categories.: request.auth.credentials.email },
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
//     const doc = await findOne({
//       db: db,
//       dbCollection: "users",
//       filter: {
//         email: request.auth.credentials.email,
//         "categories.category": payload.category,
//         "categories.todos._id": newTodo._id,
//       },
//     });
//     if (doc !== null) {
//       console.log("0", doc);
//       let insertId = doc.categories.filter((n: any) => n.category === payload.category);

//       let ab = insertId[0].todos.filter((n: any) => n._id === newTodo._id);
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//       return { ...ab[0], category: payload.category };
//     } else {
//       return h.response("No document matching credentials found");
//     }
//   },
//   // todosEditServices: async (
//   //   request: CustomRequest,
//   //   h: Hapi.ResponseToolkit
//   // ): Promise<TodoResponse> => {
//   //   // const { objid } = request.params;
//   //   // const id = new ObjectId(String(objid));
//   //   const { objid, category } = request.params;
//   //   const db: Db = request.mongo.db;
//   //   const id = new ObjectId(String(objid));
//   //   await updateOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: { email: request.auth.credentials.email, "categories.category": category },
//   //     whatToDo: { $pull: { "categories.$[outer].todos": { _id: id } } },
//   //     arrayFilters: { arrayFilters: [{ "outer.category": category }] },
//   //   });
//   //   const payload = request.payload as { todonote: string; category: string };
//   //   const newTodo = { _id: new ObjectId(), todonote: payload.todonote };
//   //   await updateOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: { email: request.auth.credentials.email, "categories.category": payload.category },
//   //     whatToDo: {
//   //       $push: {
//   //         "categories.$.todos": newTodo,
//   //       },
//   //     },
//   //   });
//   //   const doc = await findOne({
//   //     db: db,
//   //     dbCollection: "users",
//   //     filter: {
//   //       email: request.auth.credentials.email,
//   //       "categories.category": payload.category,
//   //       "categories.todos._id": newTodo._id,
//   //     },
//   //   });
//   //   if (doc !== null) {
//   //     console.log("0", doc);
//   //     let insertId = doc.categories.filter((n: any) => n.category === payload.category);

//   //     let ab = insertId[0].todos.filter((n: any) => n._id === newTodo._id);
//   //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   //     return { ...ab[0], category: payload.category };
//   //   } else {
//   //     return h.response("No document matching credentials found");
//   //   }
//   // },
//   // todosDelete: async (request: CustomRequest): Promise<number> => {
//     // const { objid, category } = request.params;
//     // const id = new ObjectId(String(objid));
//     // const db: Db = request.mongo.db;
//     // const status = await updateOne({
//     //   db: db,
//     //   dbCollection: "users",
//     //   filter: { email: request.auth.credentials.email, "categories.category": category },
//     //   whatToDo: { $pull: { "categories.$[outer].todos": { _id: id } } },
//     //   arrayFilters: { arrayFilters: [{ "outer.category": category }] },
//     // });
//     // // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//     // return status.modifiedCount;
//   // },
// };
