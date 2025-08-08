import express from 'express';
import passport from 'passport';
import {
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/project-controller';
import { createTaskController, getAllTasksController } from '../controllers/task-controller';

const router = express.Router();

router.post('/', passport.authenticate('access-token', { session: false }), createProject);

router.get('/:projectId', passport.authenticate('access-token', { session: false }), getProject);

router.patch(
  '/:projectId',
  passport.authenticate('access-token', { session: false }),
  updateProject
);

router.delete(
  '/:projectId',
  passport.authenticate('access-token', { session: false }),
  deleteProject
);

// 할 일 생성
router.post(
  '/:projectId/tasks',
  passport.authenticate('access-token', { session: false }),
  createTaskController
);

// 할 일 전체 목록 조회
router.get(
  '/:projectId/tasks',
  passport.authenticate('access-token', { session: false }),
  getAllTasksController
);

export default router;
