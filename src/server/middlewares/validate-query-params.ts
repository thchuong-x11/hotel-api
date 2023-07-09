import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export function validateQueryParams<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (err) {
      res.status(400).send(err);
    }
  };
}
