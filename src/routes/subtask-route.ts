import express from 'express';
import { updateSubtask, deleteSubtask, getDetail } from '../controllers/subtask-controller';
import passport from '../utils/passport/index';

const router = express.Router();

router.get('/:subtaskId', passport.authenticate('access-token', { session: false }), getDetail);

router.patch(
  '/:subtaskId',
  passport.authenticate('access-token', { session: false }),
  updateSubtask
);

router.delete(
  '/:subtaskId',
  passport.authenticate('access-token', { session: false }),
  deleteSubtask
);

export default router;
