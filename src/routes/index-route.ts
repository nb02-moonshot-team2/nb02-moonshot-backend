import { Router } from 'express';
import memberRouter from './member-route';
import authRouter from './auth-route';
import userRouter from './user-route';
import taskRouter from './task-route';
import subtaskRouter from './subtask-route';

const router = Router();

router.use('/', memberRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/', taskRouter);
router.use('/subtasks', subtaskRouter);

export default router;
