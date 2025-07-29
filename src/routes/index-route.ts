import { Router } from 'express';
import memberRouter from './member-route';
import authRouter from './auth-route';
import taskRouter from './task-route';
import userRouter from './user-route';

const router = Router();

router.use('/', memberRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/', taskRouter);

export default router;
