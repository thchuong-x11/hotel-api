import { RequestContext, Ctx } from '../../server/types/express';

export {};

declare global {
  namespace Express {
    export interface Request extends RequestContext {
      ctx: Ctx;
    }
  }
}
