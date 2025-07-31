import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task-service';
import { CreateTaskRequest, GetAllTaskQuery, UpdateTaskRequest } from '../utils/dtos/task-dto';
import { TaskOrder, TaskOrderBy } from '../types/task-type';
import { handleError, errorMsg, statusCode } from '../middlewares/error-handler';
import { task_status } from '@prisma/client';
import { AuthenticateRequest } from '../utils/dtos/member-dto';
import { CreateCommentRequest } from '../utils/dtos/comment-dto';

export const createTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const user = req.user;
    const taskData: CreateTaskRequest = req.body;

    if (isNaN(projectId)) {
      return handleError(next, Error, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!user || !user.id) {
      return handleError(next, Error, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const result = await taskService.createTasks(projectId, user.id, taskData);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getAllTasksController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const user = req.user;

    const { page, limit, status, assignee, keyword, order, orderBy } = req.query;

    if (isNaN(projectId)) {
      return handleError(next, Error, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!user || !user.id) {
      return handleError(next, Error, errorMsg.loginRequired, statusCode.unauthorized);
    }

    // 검색 조건 기본값 넣기
    const filters: GetAllTaskQuery = {
      projectId: projectId,
      userId: user.id,
      page: parseInt((page as string) ?? '1', 10),
      limit: parseInt((limit as string) ?? '10', 10),
      status: (status as task_status) ?? task_status.todo,
      assignee: parseInt(assignee as string, 10),
      keyword: keyword ? (keyword as string) : undefined,
      order: (order as TaskOrder) ?? TaskOrder.asc,
      orderBy: (orderBy as TaskOrderBy) ?? TaskOrderBy.createdAt,
    };

    const tasks = await taskService.getAllTasks(filters);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTaskByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const user = req.user;

    if (isNaN(taskId)) {
      return handleError(next, Error, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!user || !user.id) {
      return handleError(next, Error, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const task = await taskService.getTaskById(taskId, user.id);

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const user = req.user;
    const taskData: UpdateTaskRequest = req.body;

    if (isNaN(taskId)) {
      return handleError(next, Error, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!user || !user.id) {
      return handleError(next, Error, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const updatedTask = await taskService.updateTask(taskId, user.id, taskData);
    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
};

export const deleteTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const user = req.user;

    if (isNaN(taskId)) {
      return handleError(next, Error, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!user || !user.id) {
      return handleError(next, Error, errorMsg.loginRequired, statusCode.unauthorized);
    }

    await taskService.deleteTask(taskId, user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 댓글 추가
export const createComment = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const userId = req.user?.id;
    const { content } = req.body as CreateCommentRequest;

    if (!taskId || !content) {
      return handleError(next, Error, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!userId) {
      return handleError(next, Error, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const newComment = await taskService.createComment(taskId, userId, { content });

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};
