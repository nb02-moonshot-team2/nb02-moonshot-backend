import { subtaskService } from '../services/subtask-service';
import { NextFunction, Request, Response } from 'express';
import { handleError, errorMsg, statusCode } from '../middlewares/error-handler';

// 하위 할 일 생성

async function createSubtask(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as Express.User;
    const taskId = Number(req.params.taskId);
    if (isNaN(taskId)) {
      const validationError = new Error('Invalid TaskId');
      return handleError(next, validationError, errorMsg.invalidTaskId, statusCode.badRequest);
    }
    const createSubtaks = await subtaskService.createSubtask(user.id, taskId, req.body);
    res.status(201).json(createSubtaks);
  } catch (err) {
    next(err);
  }
}

// 하위 할 일 목록 조회

async function getListSubtasks(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as Express.User;
    const taskId = Number(req.params.taskId);
    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    if (isNaN(taskId) || isNaN(page) || isNaN(limit)) {
      const validationError = new Error('Invalid request parameters');
      return handleError(next, validationError, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }
    const subtaskList = await subtaskService.getListSubtasks(user.id, taskId, page, limit);
    res.json(subtaskList);
  } catch (err) {
    next(err);
  }
}

//  subtask 상세 조회

async function getDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as Express.User;
    const subtaskId = Number(req.params.subtaskId);
    if (isNaN(subtaskId)) {
      const validationError = new Error('Invalid SubtaskId');
      return handleError(next, validationError, errorMsg.dataNotFound, statusCode.badRequest);
    }
    const subtask = await subtaskService.getDetail(user.id, subtaskId);
    res.json(subtask);
  } catch (err) {
    next(err);
  }
}

// subtask 업데이트
async function updateSubtask(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as Express.User;
    const subtaskId = Number(req.params.subtaskId);
    if (isNaN(subtaskId)) {
      const validationError = new Error('Invalid SubtaskId');
      return handleError(next, validationError, errorMsg.dataNotFound, statusCode.badRequest);
    }
    const subtask = await subtaskService.updateSubtask(user.id, subtaskId, req.body);
    res.status(200).json(subtask);
  } catch (err) {
    next(err);
  }
}

// subtask 삭제

async function deleteSubtask(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as Express.User;
    const subtaskId = Number(req.params.subtaskId);
    if (isNaN(subtaskId)) {
      const validationError = new Error('Invalid SubtaskId');
      return handleError(next, validationError, errorMsg.dataNotFound, statusCode.badRequest);
    }
    await subtaskService.deleteSubtask(user.id, subtaskId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export { createSubtask, getListSubtasks, getDetail, updateSubtask, deleteSubtask };
