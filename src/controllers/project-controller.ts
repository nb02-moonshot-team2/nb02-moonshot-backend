import { Request, Response, NextFunction } from 'express';
import {
  createProjectService,
  getProjectService,
  updateProjectService,
  deleteProjectService,
} from '../services/project-service';
import { handleError, statusCode, errorMsg } from '../middlewares/error-handler';

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    const creatorId = req.user?.id;
    if (!creatorId) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const result = await createProjectService({ creatorId, name, description });

    if ('error' in result) {
      return handleError(next, null, result.message, result.status);
    }

    res.status(statusCode.created).json(result.data);
  } catch (error) {
    handleError(next, error, errorMsg.createProjectFailed, statusCode.internalServerError);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      return handleError(next, null, errorMsg.invalidProjectId, statusCode.badRequest);
    }

    const result = await getProjectService(projectId);

    if ('error' in result) {
      return handleError(next, null, result.message, result.status);
    }

    res.status(statusCode.success).json(result.data);
  } catch (error) {
    handleError(next, error, errorMsg.getProjectFailed, statusCode.internalServerError);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      return handleError(next, null, errorMsg.invalidProjectId, statusCode.badRequest);
    }

    const creatorId = req.user?.id;
    if (!creatorId) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const { name, description } = req.body;

    const result = await updateProjectService({ creatorId, projectId, name, description });

    if ('error' in result) {
      return handleError(next, null, result.message, result.status);
    }

    res.status(statusCode.success).json(result.data);
  } catch (error) {
    handleError(next, error, errorMsg.updateProjectFailed, statusCode.internalServerError);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      return handleError(next, null, errorMsg.invalidProjectId, statusCode.badRequest);
    }

    const creatorId = req.user?.id;
    if (!creatorId) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const result = await deleteProjectService({ creatorId, projectId });

    if ('error' in result) {
      return handleError(next, null, result.message, result.status);
    }

    res.status(statusCode.success).json(result.data);
  } catch (error) {
    handleError(next, error, errorMsg.getProjectFailed, statusCode.internalServerError);
  }
};
