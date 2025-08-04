import { Router } from 'express';
import passport from '../utils/passport/index';
import { getCommentById } from '../controllers/comment-controller';

const router = Router();

// 댓글 상세 조회
router.get(
  '/:commentId',
  passport.authenticate('access-token', { session: false }),
  getCommentById
);

export default router;
