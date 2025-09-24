import { Db, MongoClient } from 'mongodb';
import '@hapi/hapi';

declare module '@hapi/hapi' {
  interface Request {
    mongo: {
      db: Db;
      client: MongoClient;
    };
  }
}
