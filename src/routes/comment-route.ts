import { Router } from 'express';
import passport from '../utils/passport/index';
import { getCommentById, updateComment, deleteComment } from '../controllers/comment-controller';

const router = Router();

// 댓글 상세 조회
router.get(
  '/:commentId',
  passport.authenticate('access-token', { session: false }),
  getCommentById
);

// 댓글 수정
router.patch(
  '/:commentId',
  passport.authenticate('access-token', { session: false }),
  updateComment
);

// 댓글 삭제
router.delete(
  '/:commentId',
  passport.authenticate('access-token', { session: false }),
  deleteComment
);
export default router;
