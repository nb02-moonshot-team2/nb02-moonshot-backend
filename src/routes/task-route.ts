import { Router, RequestHandler } from 'express';
import passport from '../utils/passport/index';
import {
  createTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
  createComment,
} from '../controllers/task-controller';

const router = Router();

// 할 일 생성
router.post(
  '/projects/:projectId/tasks',
  passport.authenticate('access-token', { session: false }),
  createTaskController as RequestHandler
);

// 할 일에 댓글 추가
router.post(
  '/tasks/:taskId/comments',
  passport.authenticate('access-token', { session: false }),
  createComment
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
export default router;
