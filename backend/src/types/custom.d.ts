import type { Db, ObjectId } from "mongodb";
import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
interface CustomRequest extends Request {
  mongo: {
    db: Db;
  };
}
export type MongoMethodsParams = {
  db: Db;
  dbCollection: string;
  filter?: object;
  projections?: object;
  payload1?: object;
  arrayFilters?: object;
};
export type HandlerParams = {
  request: Request;
  h: ResponseToolkit;
};
export type HandlerParams1 = {
  request: Request;
};
export type Session = {
  id: ObjectId;
};
export type Decode = {
  name: string;
  email: string;
};
export type SignupType = {
  acknowledged: boolean;
  insertedId: ObjectId;
};
export type Category = {
  _id: ObjectId;
  category: string;
  todos: Todos[]; // Type of todos depends on the specific use-case.
};
export type Todos = {
  _id: ObjectId;
  todonote: string;
};
export type TodoOld = {
  _id: ObjectId;
  todonote: string;
  category: string;
};
export type User = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  categories: Category[];
};
export type UserOld = {
  name: string;
  email: string;
};
export type Email = {
  email: string;
};
export type Validate = {
  isValid: boolean;
  credentials: Email;
};
export type TodoResponse = TodoOld | TodoOld[] | ResponseObject | null;
export type CategoryOld = {
  _id: ObjectId;
  category: string;
};
export type CategoryResponse = CategoryOld[] | ResponseObject;
