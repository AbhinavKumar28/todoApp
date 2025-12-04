import type { DatabaseClient } from "../interface/databaseClient.ts";
import type { Db, InferIdType, Document as MongoDocument } from "mongodb";
import type { InsertOneResult } from "mongodb";

export class MongoAdapter implements DatabaseClient {
  private db: Db;
  constructor(db: Db) {
    this.db = db;
  }
  async findOne<T extends MongoDocument>(
    collection: string,
    filter: object,
    projection?: object | null // projection will be { "categories.$": 1 } or { name: 1, age: 1 }
  ): Promise<T | null> {
    const options = projection ? { projection } : undefined;
    return this.db.collection<T>(collection).findOne(filter, options);
  }

  async insertOne<T extends MongoDocument>(
    collection: string,
    doc: T
  ): Promise<{ insertedId: InferIdType<T> }> {
    const res: InsertOneResult<T> = await this.db.collection(collection).insertOne(doc);
    return { insertedId: res.insertedId };
  }

  async updateOne(
    collection: string,
    filter: object,
    update: object,
    options?: object
  ): Promise<{ modifiedCount?: number }> {
    const res = await this.db.collection(collection).updateOne(filter, update, options);
    return { modifiedCount: res.modifiedCount };
  }

  async aggregate<T extends MongoDocument>(collection: string, pipeline: object[]): Promise<T[]> {
    return this.db.collection<T>(collection).aggregate<T>(pipeline).toArray();
  }
}
