/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Hapi from "@hapi/hapi";
import type { User } from "./types/custom.d.ts";
export const findOne = async (
  request: Hapi.Request,
  filter?: object,
  options?: object,
  payload1?: object,
  moreOptions?: object
): Promise<any> => {
  if (options === undefined && filter !== undefined) {
    const a = await request.mongo.db.collection("users").findOne(filter);
    return a;
  } else if (filter !== undefined) {
    const a = await request.mongo.db.collection("users").findOne(filter, options);
    return a;
  }
};
export const insertOne = async (
  request: Hapi.Request,
  filter?: object,
  options?: object,
  payload1?: object,
  moreOptions?: object
): Promise<any> => {
  if (payload1 !== undefined) {
    const a = await request.mongo.db.collection("users").insertOne(payload1);
    return a;
  }
};
export const updateOne = async (
  request: Hapi.Request,
  filter?: object,
  options?: object,
  payload1?: object,
  moreOptions?: object
): Promise<any> => {
  if (moreOptions === undefined && filter !== undefined && options !== undefined) {
    const a = await request.mongo.db.collection("users").updateOne(filter, options);
    return a;
  } else if (filter !== undefined && options !== undefined) {
    const a = await request.mongo.db.collection("users").updateOne(filter, options, moreOptions);
    return a;
  }
};
