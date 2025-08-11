import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { handleError, statusCode, errorMsg } from '../middlewares/error-handler';
const prisma = new PrismaClient();

export async function authorization(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const projectId = Number(req.params.projectId);

  if (!userId) {
    return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
  }

  if (isNaN(projectId)) {
    return handleError(next, null, errorMsg.invalidProjectId, statusCode.badRequest);
  }

  try {
    const isMember = await prisma.project_members.findFirst({
      where: { projectId, userId },
    });

    if (!isMember) {
      return handleError(next, null, errorMsg.accessDenied, statusCode.forbidden);
    }

    next();
  } catch (error) {
    handleError(next, error, errorMsg.serverError, statusCode.internalServerError);
  }
}
