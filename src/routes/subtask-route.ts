import express from 'express';
import { updateSubtask, deleteSubtask, getDetail } from '../controllers/subtask-controller';
import passport from '../utils/passport/index';

const router = express.Router();

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   get:
 *     summary: 하위 할 일 조회
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 하위 할 일 ID
 *     security:
 *       - access-token: []
 *     responses:
 *       '200':
 *         description: 하위 할 일 상세 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/subtaskResponse'
 *       '400':
 *         description: 잘못된 요청 형식
 *       '401':
 *         description: 로그인이 필요합니다.
 *       '403':
 *         description: 프로젝트 멤버가 아닙니다.
 *       '404':
 *         description: 해당 하위 할 일을 찾을 수 없습니다.
 */

router.get('/:subtaskId', passport.authenticate('access-token', { session: false }), getDetail);

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   patch:
 *     summary: 하위 할 일 수정
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 하위 할 일 ID
 *     security:
 *       - access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/subtaskUpdateOrCreateRequest'
 *     responses:
 *       '200':
 *         description: 하위 할 일 수정
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/subtaskResponse'
 *       '400':
 *         description: 잘못된 요청 형식
 *       '401':
 *         description: 로그인이 필요합니다.
 *       '403':
 *         description: 프로젝트 멤버가 아닙니다.
 */

router.patch(
  '/:subtaskId',
  passport.authenticate('access-token', { session: false }),
  updateSubtask
);

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   delete:
 *     summary: 특정 서브태스크 삭제
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 서브태스크 ID
 *     security:
 *       - access-token: []
 *     responses:
 *       '204':
 *         description: 삭제 성공 (응답 본문 없음)
 *       '400':
 *         description: 잘못된 요청 형식
 *       '401':
 *         description: 로그인이 필요합니다
 *       '403':
 *         description: 프로젝트 멤버가 아닙니다
 *       '404':
 *         description: (없음)
 */

router.delete(
  '/:subtaskId',
  passport.authenticate('access-token', { session: false }),
  deleteSubtask
);

export default router;
