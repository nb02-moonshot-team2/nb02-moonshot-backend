import express from 'express';
import passport from 'passport';
import {
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/project-controller';
import { createTaskController, getAllTasksController } from '../controllers/task-controller';
import { authorization } from '../middlewares/authorization';

const router = express.Router();

router.post('/', passport.authenticate('access-token', { session: false }), createProject);

router.get(
  '/:projectId',
  passport.authenticate('access-token', { session: false }),
  authorization,
  getProject
);

router.patch(
  '/:projectId',
  passport.authenticate('access-token', { session: false }),
  authorization,
  updateProject
);

router.delete(
  '/:projectId',
  passport.authenticate('access-token', { session: false }),
  authorization,
  deleteProject
);

router.post(
  '/:projectId/tasks',
  passport.authenticate('access-token', { session: false }),
  authorization,
  createTaskController
);

router.get(
  '/:projectId/tasks',
  passport.authenticate('access-token', { session: false }),
  authorization,
  getAllTasksController
);

export default router;
