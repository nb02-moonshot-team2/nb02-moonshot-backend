import { Request, Response, NextFunction } from 'express';
import {
  createProjectService,
  getProjectService,
  updateProjectService,
} from '../services/project-service';
import { handleError, statusCode, errorMsg } from '../utils/error';

// 프로젝트 생성
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const creatorId = 1; // 인증 후 req.user.id로 교체 예정

    const result = await createProjectService({ creatorId, name, description });

    if (result.error) {
      return handleError(next, null, result.message, result.status);
    }

    res.status(statusCode.created).json(result.data);
  } catch (error) {
    handleError(next, error, errorMsg.createProjectFailed, statusCode.internalServerError);
  }
};

// 프로젝트 조회
export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      return handleError(next, null, errorMsg.invalidProjectId, statusCode.badRequest);
    }

    const result = await getProjectService(projectId);
    if (result.error) {
      return handleError(next, null, result.message, result.status);
    }

    res.status(statusCode.success).json(result.data);
  } catch (error) {
    handleError(next, error, errorMsg.getProjectFailed, statusCode.internalServerError);
  }
};

// 프로젝트 수정
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      return handleError(next, null, errorMsg.invalidProjectId, statusCode.badRequest);
    }

    const creatorId = 1; // 추후 req.user.id
    const { name, description } = req.body;

    const result = await updateProjectService({ creatorId, projectId, name, description });

    if (result.error) {
      return handleError(next, null, result.message, result.status);
    }

    res.status(statusCode.success).json(result.data);
  } catch (error) {
    handleError(next, error, errorMsg.updateProjectFailed, statusCode.internalServerError);
  }
};

// 프로젝트 삭제
