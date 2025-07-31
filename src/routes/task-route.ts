import { Router } from 'express';
import passport from '../utils/passport';
import {
  createTaskController,
  getAllTasksController,
  createComment,
} from '../controllers/task-controller';

const router = Router();

router.route('/projects/:projectId/tasks').post(createTaskController).get(getAllTasksController);

// 할 일에 댓글 추가
router.post(
  '/tasks/:taskId/comments',
  passport.authenticate('access-token', { session: false }),
  createComment
);

export default router;
