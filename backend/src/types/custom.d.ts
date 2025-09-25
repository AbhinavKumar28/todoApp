import { ObjectId } from "mongodb";
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
export type User = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  categories: Category[];
};
export type Validate = {
  isValid: boolean;
};
