import { Router } from 'express';
import memberRouter from './member-route';
import authRouter from './auth-route';
import userRouter from './user-route';
import projectRouter from './project-route';
import taskRouter from './task-route';
import subtaskRouter from './subtask-route';
import commentRouter from './comment-route';
import fileRouter from './file-upload-route';

const router = Router();

router.use('/', memberRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/', taskRouter);
router.use('/subtasks', subtaskRouter);
router.use('/comments', commentRouter);
router.use('/files', fileRouter);

export default router;
