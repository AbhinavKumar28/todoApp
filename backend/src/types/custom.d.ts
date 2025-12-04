import type { Db, Filter, ObjectId, UpdateFilter } from "mongodb";
import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { Boom } from "@hapi/boom";
interface AuthCredentials {
  email: string;
}
// interface CategoryTodos {
//   category:string;
// }
interface TodosDeleteParams {
  objid: string;
  category: string;
}
interface CustomRequest extends Request {
  mongo: {
    db: Db;
  };
  auth: {
    credentials: AuthCredentials;
  };
  params: TodosDeleteParams;
}
interface TodosParams {
  // objid: string;
  categories: string;
}
interface CustomRequestTodo extends Request {
  mongo: {
    db: Db;
  };
  auth: {
    credentials: AuthCredentials;
  };
  params: TodosParams;
}
// interface TodosParams {
//   objid: string;
// }
// interface CustomRequestCategory extends Request {
//   mongo: {
//     db: Db;
//   };
//   auth: {
//     credentials: AuthCredentials;
//   };
//   params: ;
// }
export interface FindQueryOptions {
  projection?: Record<string, 0 | 1>;
}
export interface UpdateQueryOptions {
  arrayFilters?: Document[];
}
export type findOneDbMethods<T> = {
  db: Db;
  collection: string;
  filter?: Filter<T>;
  options?: FindQueryOptions;
};
export type insertOneDbMethods<T> = {
  db: Db;
  collection: string;
  payload: T & {};
};
export type updateOneDbMethods<T> = {
  db: Db;
  collection: string;
  filter: Filter<T>;
  update: UpdateFilter<T>;
  options?: UpdateQueryOptions;
};
export type aggregateDbMethods = {
  db: Db;
  collection: string;
  pipeline: Document[];
};
export type MongoMethodsParams<T> = {
  db: Db;
  dbCollection: string;
  filter?: Filter<T>;
  whatToDo?: UpdateFilter<T>; //push or pull come here
  whatToShow?: string[]; // projections come here
  payloadToInsert?: T & {};
  arrayFilters?: object;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  pipeline?: Array | undefined;
};
export type MongoMethodsParamsAg<T extends Document> = {
  db: Db;
  dbCollection: string;
  filter?: Filter<T>;
  whatToDo?: UpdateFilter<T>; //push or pull come here
  whatToShow?: string[]; // projections come here
  payloadToInsert?: T & {};
  arrayFilters?: object;
  pipeline?: Document[];
};
export type HandlerParams = {
  request: Request;
  h: ResponseToolkit;
};
// export type HandlerParams{
//   objid: string;
// }
export type HandlerParams1 = {
  request: Request;
};
export type Session = {
  id: ObjectId;
};
export type Decode = {
  name: string | undefined;
  email: string | undefined;
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
  sharedwith?: string[];
};
export type TodoOld = {
  _id: ObjectId;
  todonote: string;
  category: string;
};
export type User = {
  _id?: ObjectId;
  name?: string;
  email?: string;
  password?: string;
  categories?: Category[];
};
export type UserUpdate = Document & {
  _id: ObjectId;
  name?: string;
  email?: string;
  password?: string;
  categories?: Category[];
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
export type CategoryResponse = Category | CategoryOld[] | ResponseObject | undefined;
export type Login = Error | Boom | LoginModel;
export type LoginModel = {
  isValid: boolean;
  credentials: Decode;
  token: string;
};
