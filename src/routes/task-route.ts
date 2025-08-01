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
import { createSubtask, getListSubtasks } from '../controllers/subtask-controller';

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

// subtask 생성, subtask 목록 조회 추가
/**
 * @swagger
 * /tasks/{taskId}/subtasks:
 *   post:
 *     summary: 하위 할 일 생성
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: 하위 할 일이 속한 할 일 ID
 *     security:
 *       - access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/subtaskUpdateOrCreateRequest'
 *     responses:
 *       '201':
 *         description: 하위 할 일 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/subtaskResponse'
 *       '400':
 *         description: 잘못된 요청 형식
 *       '401':
 *         description: 로그인이 필요합니다
 *       '403':
 *         description: 프로젝트 멤버가 아닙니다
 */

router.post(
  '/tasks/:taskId/subtasks',
  passport.authenticate('access-token', { session: false }),
  createSubtask
);

/**
 * @swagger
 * /tasks/{taskId}/subtasks:
 *   get:
 *     summary: 하위 할 일 목록 조회
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: 하위 할 일 목록을 조회할 할 일 ID
 *     security:
 *       - access-token: []
 *     responses:
 *       '200':
 *         description: 서브태스크 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/subtaskResponse'
 *       '401':
 *         description: 인증 실패
 *       '403':
 *         description: 권한 없음
 */

router.get(
  '/tasks/:taskId/subtasks',
  passport.authenticate('access-token', { session: false }),
  getListSubtasks
);
export default router;
