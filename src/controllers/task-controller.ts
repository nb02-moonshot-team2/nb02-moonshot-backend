import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task-service';
import { CreateTaskRequest, GetAllTaskQuery } from '../utils/dtos/task-dto';
import { TaskOrder, TaskOrderBy } from '../types/task-type';
import { handleError, errorMsg, statusCode } from '../middlewares/error-handler';
import { task_status } from '@prisma/client';




export const createTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const user = req.user;
    const taskData: CreateTaskRequest = req.body;

    if (isNaN(projectId)) {
      return handleError(next, Error, errorMsg.badRequest, statusCode.badRequest);
    }

    if (!user || !user.id) {
      return handleError(next, Error, errorMsg.unauthorized, statusCode.unauthorized);
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

    const {page,
      limit,
      status,
      assignee,
      keyword,
      order,
      order_by,
    } = req.query;

    if (isNaN(projectId)) {
      return handleError(next, Error, errorMsg.badRequest, statusCode.badRequest);
    }

    if (!user || !user.id) {
      return handleError(next, Error, errorMsg.unauthorized, statusCode.unauthorized);
    }

    // 검색 조건 기본값 넣기 
    const filters: GetAllTaskQuery = {
      projectId: projectId,
      userId: user.id,
      page: parseInt(page as string ?? '1', 10),
      limit: parseInt(limit as string ?? '10', 10),
      status: (status as task_status) ?? task_status.todo,
      assignee: parseInt(assignee as string, 10),
      keyword: keyword ? (keyword as string) : undefined,
      order: (order as TaskOrder) ?? TaskOrder.asc,
      orderBy: (order_by as TaskOrderBy) ?? TaskOrderBy.createdAt,
    };

    const tasks = await taskService.getAllTasks(filters);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};