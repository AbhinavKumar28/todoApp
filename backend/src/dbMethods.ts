/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MongoMethodsParams } from "./types/custom.d.ts";
export const findOne = async (params: MongoMethodsParams): Promise<any> => {
  if (params.whatToShow === undefined && params.filter !== undefined) {
    const a = await params.db.collection(params.dbCollection).findOne(params.filter);
    return a;
  } else if (params.filter !== undefined) {
    const a = await params.db
      .collection(params.dbCollection)
      .findOne(params.filter, params.whatToShow);
    return a;
  }
};
export const insertOne = async (params: MongoMethodsParams): Promise<any> => {
  if (params.payloadToInsert !== undefined) {
    const a = await params.db.collection(params.dbCollection).insertOne(params.payloadToInsert);
    return a;
  }
};
export const updateOne = async (params: MongoMethodsParams): Promise<any> => {
  if (
    params.arrayFilters === undefined &&
    params.filter !== undefined &&
    params.whatToDo !== undefined
  ) {
    const a = await params.db
      .collection(params.dbCollection)
      .updateOne(params.filter, params.whatToDo);
    return a;
  } else if (params.filter !== undefined && params.whatToDo !== undefined) {
    const a = await params.db
      .collection(params.dbCollection)
      .updateOne(params.filter, params.whatToDo, params.arrayFilters);
    return a;
  }
};
export const aggregate = async (params: MongoMethodsParams): Promise<any> => {
  if (params.pipeline !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const a = await params.db.collection(params.dbCollection).aggregate(params.pipeline).toArray();
    return a;
  }
};
