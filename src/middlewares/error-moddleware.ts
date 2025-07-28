import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const { status, message } = err as { status?: number; message?: string };
  res.status(status || 500).json({ message: message || '서버 오류가 발생했습니다' });
};
