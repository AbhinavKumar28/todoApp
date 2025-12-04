import { ObjectId } from "mongodb";
import { MongoAdapter } from "../adapters/mongodbAdapter.ts";
import type { User } from "../types/custom.d.ts";
export class UserModel {
  private db: MongoAdapter;
  private collection: string;
  constructor(db: MongoAdapter, collection = "users") {
    this.db = db;
    this.collection = collection;
  }
  async insertUser(user: User): Promise<{
    insertedId: ObjectId;
  }> {
    return this.db.insertOne<User>(this.collection, user);
  }
  async findByEmailWithProjection(email: string, projection?: object): Promise<User | null> {
    return this.db.findOne<User>(this.collection, { email }, projection);
  }
  async pushCategory(
    email: string,
    categoryName: string
  ): Promise<{
    _id: ObjectId;
    category: string;
    todos: never[];
  }> {
    const newCategory = { _id: new ObjectId(), category: categoryName, todos: [] };
    await this.db.updateOne(this.collection, { email }, { $push: { categories: newCategory } });
    return newCategory;
  }
  async deleteTodoById(
    email: string,
    category: string,
    todoId: ObjectId
  ): Promise<number | undefined> {
    const result = await this.db.updateOne(
      this.collection,
      {
        email,
        "categories.category": category,
      },
      {
        $pull: { "categories.$[outer].todos": { _id: todoId } },
      },
      {
        arrayFilters: [{ "outer.category": category }],
      }
    );

    return result?.modifiedCount;
  }
  async addTodoToCategory(
    email: string,
    category: string,
    todo: { _id: ObjectId; todonote: string }
  ): Promise<number | undefined> {
    const result = await this.db.updateOne(
      this.collection,
      {
        email,
        "categories.category": category,
      },
      {
        $push: {
          "categories.$.todos": todo,
        },
      }
    );

    return result.modifiedCount;
  }
  async findTodoById(email: string, category: string, todoId: ObjectId): Promise<User | null> {
    return this.db.findOne<User>(
      this.collection,
      {
        email,
        "categories.category": category,
        "categories.todos._id": todoId,
      },
      {
        "categories.$": 1,
      }
    );
  }
  async getTodosWithCategories(email: string): Promise<User | null> {
    // get todos with their categories
    return this.db.findOne<User>(
      this.collection,
      { email },
      { "categories.todos": 1, "categories.category": 1 }
    );
  }
  async getTodosByCategory(email: string, category: string): Promise<User | null> {
    // get todos of a particular category
    return this.db.findOne<User>(
      this.collection,
      { email, "categories.category": category },
      { "categories.$": 1 }
    );
  }
}
