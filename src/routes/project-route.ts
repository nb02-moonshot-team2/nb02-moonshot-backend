import express from 'express';
import passport from 'passport';
import {
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/project-controller';

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

export default router;
