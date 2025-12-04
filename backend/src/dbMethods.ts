import type { UpdateResult, InsertOneResult } from "mongodb";
import type {
  findOneDbMethods,
  updateOneDbMethods,
  insertOneDbMethods,
  aggregateDbMethods,
} from "./types/custom.d.ts";
// Interface defined.
// findOne(db, collection, filter, options);
// updateOne(collection, filter, update, options);
// insertOne(collection, payload);
// aggregate(collection, pipeline, options);
export const findOne = async <T extends Document>(
  params: findOneDbMethods<T>
): Promise<null | T> => {
  if (params.filter !== undefined) {
    const a = await params.db
      .collection<T>(params.collection)
      .findOne(params.filter, params.options);
    return a;
  }
  return null;
  
};
export const insertOne = async <T>(params: insertOneDbMethods<T>): Promise<InsertOneResult> => {
  if (params.payload === undefined) {
    throw new Error("Missing required parameters: payload");
  }
  const a = await params.db.collection(params.collection).insertOne(params.payload);
  return a;
};
export const updateOne = async <T extends Document>(
  params: updateOneDbMethods<T>
): Promise<UpdateResult> => {
  if (!params.filter || !params.update) {
    throw new Error("Missing required parameters: filter or whatToDo");
  }
  const a = await params.db
    .collection<T>(params.collection)
    .updateOne(params.filter, params.update, params.options);
  return a;
};
export const aggregate = async <T extends Document>(params: aggregateDbMethods): Promise<T[]> => {
  if (params.pipeline === undefined) {
    throw new Error("Missing required parameters: pipeline");
  }
  const a = await params.db
    .collection<T>(params.collection)
    .aggregate<T>(params.pipeline)
    .toArray();
  return a;
};
// export const aggregate = async <T extends Document>(
//   params: MongoMethodsParamsAg<T>
// ): Promise<T[]> => {
//   if (params.pipeline !== undefined) {
//     const a = await params.db
//       .collection<T>(params.dbCollection)
//       .aggregate<T>(params.pipeline)
//       .toArray();
//     return a;
//   }
//   return [];
// };
// export const updateOne = async <T extends Document>(
//   params: MongoMethodsParams<T>
// ): Promise<UpdateResult> => {
//   if (!params.filter || !params.whatToDo) {
//     console.log("if with error");
//     throw new Error("Missing required parameters: filter or whatToDo");
//   }
//   console.log("whattodo", params.whatToDo);
//   console.log("filter", params.filter);
//   console.log("arrayfilters", params.arrayFilters);
//   const a = await params.db
//     .collection<T>(params.dbCollection)
//     .updateOne(params.filter, params.whatToDo, params.arrayFilters);
//   console.log("a", a);
//   return a;
// };
// export const insertOne = async <T>(params: MongoMethodsParams<T>): Promise<InsertOneResult> => {
//   if (params.payloadToInsert === undefined) {
//     throw new Error("Missing required parameters: payload");
//   }
//   const a = await params.db.collection(params.dbCollection).insertOne(params.payloadToInsert);
//   return a;
// };

// export const findOne = async <T extends { [key: string]: any }>(
//   params: MongoMethodsParams<T>
// ): Promise<T | null> => {
//   if (params.filter !== undefined) {
//     console.log("b", params.whatToShow, "b");
//     const projection = params.whatToShow?.reduce<Record<string, number>>((acc, cur) => {
//       acc[cur] = 1;
//       console.log(acc);
//       return acc;
//     }, {});
//     console.log(params.filter, projection);
//     const a = await params.db.collection<T>(params.dbCollection).findOne(params.filter, projection);
//     console.log("starting", a, "ending");
//     return a;
//   }
//   return null;
// };

// export const aggregate = async <T extends Document>(
//   params: MongoMethodsParamsAg<T>
// ): Promise<T[]> => {
//   if (params.pipeline !== undefined) {
//     const a = await params.db
//       .collection<T>(params.dbCollection)
//       .aggregate<T>(params.pipeline)
//       .toArray();
//     return a;
//   }
//   return [];
// };
