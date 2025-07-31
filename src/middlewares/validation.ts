import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { statusCode } from './error-handler';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.badRequest).json({ message: errors.array()[0].msg });
  }
  next();
};
