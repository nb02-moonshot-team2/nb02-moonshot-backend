import { Request, Response, NextFunction } from 'express';

interface CustomError {
  status?: number;
  message?: string;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error('❌ 서버 에러:', err);
  res.status(status).json({ message });
};
