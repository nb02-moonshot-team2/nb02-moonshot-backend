import { RequestHandler } from 'express';
import UserService from '../services/user-service';
import { handleError, statusCode, errorMsg } from '../middlewares/error-handler';

const userService = new UserService();

export const getMyInfoController: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);

    const user = await userService.getMyInfo(userId);
    res.status(statusCode.success).json(user);
  } catch {
    handleError(next, null, errorMsg.getUserFailed, statusCode.internalServerError);
  }
};

export const updateMyInfoController: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);

    const updatedUser = await userService.updateMyInfo(userId, req.body);
    res.status(statusCode.success).json(updatedUser);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === '현재 비밀번호가 필요합니다.')
        return handleError(next, err, err.message, statusCode.badRequest);
      if (err.message === '현재 비밀번호가 일치하지 않습니다.')
        return handleError(next, err, err.message, statusCode.unauthorized);
      if (err.message === errorMsg.userNotFound)
        return handleError(next, err, err.message, statusCode.notFound);
    }
    handleError(next, err, errorMsg.updateUserFailed, statusCode.internalServerError);
  }
};

export const getMyProjectsController: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const order = req.query.order === 'desc' ? 'desc' : 'asc';
    const orderBy = req.query.order_by === 'name' ? 'name' : 'createdAt';

    const result = await userService.getMyProjects(userId, {
      page,
      limit,
      order,
      orderBy,
    });

    res.status(statusCode.success).json(result);
  } catch (err) {
    handleError(next, err, '프로젝트 목록 조회 실패', statusCode.internalServerError);
  }
};

export const getMyTasksController: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);

    const filter = {
      from: req.query.from ? String(req.query.from) : undefined,
      to: req.query.to ? String(req.query.to) : undefined,
      projectId: req.query.project_id ? Number(req.query.project_id) : undefined,
      status: req.query.status
        ? (String(req.query.status) as 'todo' | 'inProgress' | 'done')
        : undefined,
      assignee: req.query.assignee ? Number(req.query.assignee) : undefined,
      keyword: req.query.keyword ? String(req.query.keyword) : undefined,
    };

    const tasks = await userService.getMyTasks(userId, filter);

    res.status(statusCode.success).json(tasks);
  } catch (err) {
    handleError(next, err, '할 일 목록 조회 실패', statusCode.internalServerError);
  }
};
