import { ObjectId } from "mongodb";
import Hapi from "@hapi/hapi";
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
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
};
export type Validate = {
  isValid: boolean;
};
export type TodoResponse = TodoOld[] | Hapi.ResponseObject;
export type CategoryOld = {
  _id: ObjectId;
  category: string;
};
export type CategoryResponse = CategoryOld[] | Hapi.ResponseObject;
