import { Router } from 'express';
import passport from '../utils/passport/index';
import {
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
  createComment,
  getCommentsByTask,
} from '../controllers/task-controller';
import { createSubtask, getListSubtasks } from '../controllers/subtask-controller';

const router = Router();

// 할 일 단일 조회
router.get(
  '/:taskId',
  passport.authenticate('access-token', { session: false }),
  getTaskByIdController
);

// 할 일 수정
router.patch(
  '/:taskId',
  passport.authenticate('access-token', { session: false }),
  updateTaskController
);

// 할 일 삭제
router.delete(
  '/:taskId',
  passport.authenticate('access-token', { session: false }),
  deleteTaskController
);

// subtask 생성, subtask 목록 조회 추가
router.post(
  '/:taskId/subtasks',
  passport.authenticate('access-token', { session: false }),
  createSubtask
);

router.get(
  '/:taskId/subtasks',
  passport.authenticate('access-token', { session: false }),
  getListSubtasks
);

// 댓글 생성
router.post(
  '/:taskId/comments',
  passport.authenticate('access-token', { session: false }),
  createComment
);

// 댓글 조회 (task 기준)
router.get(
  '/:taskId/comments',
  passport.authenticate('access-token', { session: false }),
  getCommentsByTask
);
export default router;
