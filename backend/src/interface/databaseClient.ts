import type { InferIdType } from "mongodb";
export interface DatabaseClient {
  findOne<T extends Document>(
    collection: string,
    filter: object,
    projection?: object | null
  ): Promise<T | null>;
  insertOne<T extends Document>(
    collection: string,
    doc: T
  ): Promise<{ insertedId: InferIdType<T> }>;
  updateOne(
    collection: string,
    filter: object,
    update: object,
    options?: object
  ): Promise<{ modifiedCount?: number }>;
  aggregate<T extends Document>(collection: string, pipeline: object[]): Promise<T[]>;
}
export interface FindByEmail<T extends Document> {
  findByEmail(email: string, projection?: object): Promise<T | null>;
}
