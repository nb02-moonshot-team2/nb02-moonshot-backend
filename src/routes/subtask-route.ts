import express from 'express';
import { updateSubtask, deleteSubtask, getDetail } from '../controllers/subtask-controller';
import passport from '../utils/passport/index';

const router = express.Router();

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   get:
 *     summary: 특정 서브태스크 상세 조회
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 서브태스크 ID
 *     security:
 *       - access-token: []
 *     responses:
 *       200:
 *         description: 서브태스크 상세 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123"
 *                 title:
 *                   type: string
 *                   example: "서브태스크 제목"
 *                 completed:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: 인증 실패
 */
router.get('/:subtaskId', passport.authenticate('access-token', { session: false }), getDetail);

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   patch:
 *     summary: 특정 서브태스크 수정
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 서브태스크 ID
 *     security:
 *       - access-token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "변경된 제목"
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
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
 *       204:
 *         description: 삭제 성공 (응답 본문 없음)
 *       401:
 *         description: 인증 실패
 */
router.delete(
  '/:subtaskId',
  passport.authenticate('access-token', { session: false }),
  deleteSubtask
);

export default router;
