
import * as Joi from 'joi';

declare module 'joi' {
  interface Root {
    objectId(): Joi.StringSchema;
  }
}

declare module 'joi-objectid' {
  import { Root } from 'joi';
  function joiObjectId(joi: Root): void;
  export default joiObjectId;
}
