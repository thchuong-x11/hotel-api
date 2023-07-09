import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

import config from '../../config';
import { ConsoleLogger } from '../../utils/logger';

export function addRequestContext(app: Express): void {
  app.use((req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.ctx = {} as any;
    req.ctx.logger = new ConsoleLogger(config.logger.level);
    const requestId = uuidv4();
    req.headers['X-Request-Id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  });
}
