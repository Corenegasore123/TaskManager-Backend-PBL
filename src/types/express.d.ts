import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export type AsyncHandler = RequestHandler;
export type SyncHandler = RequestHandler; 