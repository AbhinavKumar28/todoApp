import Hapi from "@hapi/hapi";
import type { User } from "./types/custom.d.ts";
export const modelFunc = async (
  request: Hapi.Request,
  query: string,
  filter?: object,
  options?: object,
  payload1?: object,
  moreOptions?: object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  if (query === "findOne") {
    if (options === undefined && filter !== undefined) {
      const a = await request.mongo.db.collection("users").findOne(filter);
      return a;
    } else if (filter !== undefined) {
      const a = await request.mongo.db.collection("users").findOne(filter, options);
      return a;
    }
  } else if (query === "updateOne") {
    if (moreOptions === undefined && filter !== undefined && options !== undefined) {
      const a = await request.mongo.db.collection("users").updateOne(filter, options);
      return a;
    } else if (filter !== undefined && options !== undefined) {
      const a = await request.mongo.db.collection("users").updateOne(filter, options, moreOptions);
      return a;
    }
  } else if (query === "insertOne") {
    if (payload1 !== undefined) {
      const a = await request.mongo.db.collection("users").insertOne(payload1);
      return a;
    }
  } else if (query === "find") {
    if (filter !== undefined) {
      const a: User[] = (await request.mongo.db
        .collection("users")
        .find(filter)
        .toArray()) as User[];
      return a;
    }
  }
};
