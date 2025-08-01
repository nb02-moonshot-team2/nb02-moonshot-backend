// src/routes/user-route.ts
import express from 'express';
import passport from '../utils/passport/index';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validation';
import {
  getMyInfoController,
  updateMyInfoController,
  getMyProjectsController,
  getMyTasksController,
} from '../controllers/user-controller';

const router = express.Router();

router.get('/me', passport.authenticate('access-token', { session: false }), getMyInfoController);

router.patch(
  '/me',
  passport.authenticate('access-token', { session: false }),
  [
    body('email').optional().isEmail().withMessage('이메일 형식이 올바르지 않습니다.'),
    body('name').optional().isString().withMessage('이름은 문자열이어야 합니다.'),
    body('profileImage')
      .optional({ nullable: true })
      .isURL()
      .withMessage('이미지 URL이 유효하지 않습니다.'),
    body('currentPassword').optional().isString(),
    body('newPassword')
      .optional()
      .isString()
      .isLength({ min: 8 })
      .withMessage('비밀번호는 최소 8자 이상이어야 합니다.'),
  ],
  validateRequest,
  updateMyInfoController
);

router.get(
  '/me/projects',
  passport.authenticate('access-token', { session: false }),
  getMyProjectsController
);

router.get(
  '/me/tasks',
  passport.authenticate('access-token', { session: false }),
  getMyTasksController
);

export default router;
