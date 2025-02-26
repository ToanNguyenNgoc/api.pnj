import { Request } from 'express';

export type RequestHeaderType<Data> = Request & {
  user: Data;
};
