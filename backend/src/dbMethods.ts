/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MongoMethodsParams } from "./types/custom.d.ts";
export const findOne = async (params: MongoMethodsParams): Promise<any> => {
  if (params.projections === undefined && params.filter !== undefined) {
    const a = await params.db.collection(params.dbCollection).findOne(params.filter);
    return a;
  } else if (params.filter !== undefined) {
    const a = await params.db
      .collection(params.dbCollection)
      .findOne(params.filter, params.projections);
    return a;
  }
};
export const insertOne = async (params: MongoMethodsParams): Promise<any> => {
  if (params.payload1 !== undefined) {
    const a = await params.db.collection(params.dbCollection).insertOne(params.payload1);
    return a;
  }
};
export const updateOne = async (params: MongoMethodsParams): Promise<any> => {
  if (
    params.arrayFilters === undefined &&
    params.filter !== undefined &&
    params.projections !== undefined
  ) {
    const a = await params.db
      .collection(params.dbCollection)
      .updateOne(params.filter, params.projections);
    return a;
  } else if (params.filter !== undefined && params.projections !== undefined) {
    const a = await params.db
      .collection(params.dbCollection)
      .updateOne(params.filter, params.projections, params.arrayFilters);
    return a;
  }
};
