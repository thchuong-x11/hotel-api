import { NextFunction, Response } from 'express';

import { RequestContext } from '../../server/types/express';

import { GetHotelsService } from './services/get-hotels-service';

export function injectDependencies(req: RequestContext, _res: Response, next: NextFunction): void {
  const logger = req.ctx.logger;
  req.ctx.getHotelsService = new GetHotelsService({ logger });
  next();
}
