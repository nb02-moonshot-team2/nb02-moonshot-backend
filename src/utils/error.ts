import { Request, Response, NextFunction } from 'express';

export const statusCode = {
  success: 200,
  created: 201,
  badRequest: 400,
  notFound: 404,
  internalServerError: 500,
} as const;

export const errorMsg = {
  maxProjectLimit: '프로젝트는 최대 5개까지 생성할 수 있습니다.',
  invalidProjectId: '유효한 프로젝트 ID가 아닙니다.',
  projectNotFound: '프로젝트를 찾을 수 없습니다.',
  createProjectFailed: '프로젝트 생성 중 오류가 발생했습니다.',
  getProjectFailed: '프로젝트 조회 중 오류가 발생했습니다.',
  serverError: '서버 내부 오류가 발생했습니다.',
} as const;

export const handleError = (
  next: NextFunction,
  error: unknown,
  message: string = errorMsg.serverError,
  status: number = statusCode.internalServerError
) => {
  console.error('Error:', error);
  const err = new Error(message) as Error & { status?: number };
  err.status = status;
  return next(err);
};

export const errorHandler = (
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || statusCode.internalServerError;
  const message = err.message || errorMsg.serverError;

  res.status(status).json({
    success: false,
    message,
  });
};
