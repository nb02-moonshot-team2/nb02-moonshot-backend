import { Router, RequestHandler } from 'express';
import passport from '../utils/passport/index';
import {
  createTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
  createComment,
  getCommentsByTask,
} from '../controllers/task-controller';
import { createSubtask, getListSubtasks } from '../controllers/subtask-controller';

const router = Router();

// 할 일 생성
router.post(
  '/projects/:projectId/tasks',
  passport.authenticate('access-token', { session: false }),
  createTaskController as RequestHandler
);

// 할 일 전체 목록 조회
router.get(
  '/projects/:projectId/tasks',
  passport.authenticate('access-token', { session: false }),
  getAllTasksController as RequestHandler
);

// 할 일 단일 조회
router.get(
  '/tasks/:taskId',
  passport.authenticate('access-token', { session: false }),
  getTaskByIdController as RequestHandler
);

// 할 일 수정
router.patch(
  '/tasks/:taskId',
  passport.authenticate('access-token', { session: false }),
  updateTaskController as RequestHandler
);

// 할 일 삭제
router.delete(
  '/tasks/:taskId',
  passport.authenticate('access-token', { session: false }),
  deleteTaskController as RequestHandler
);

// subtask 생성, subtask 목록 조회 추가

// 하위 할 일 생성
router.post(
  '/tasks/:taskId/subtasks',
  passport.authenticate('access-token', { session: false }),
  createSubtask
);


// 하위 할 일 목록 조회
router.get(
  '/tasks/:taskId/subtasks',
  passport.authenticate('access-token', { session: false }),
  getListSubtasks
);

// 댓글 생성
router.post(
  '/tasks/:taskId/comments',
  passport.authenticate('access-token', { session: false }),
  createComment
);

// 댓글 조회 (task 기준)
router.get(
  '/tasks/:taskId/comments',
  passport.authenticate('access-token', { session: false }),
  getCommentsByTask
);

export default router;
