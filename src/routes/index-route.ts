import { Router } from 'express';
import memberRouter from './member-route';
import authRouter from './auth-route';
import userRouter from './user-route';
import taskRouter from './task-route';
const router = Router();

router.use('/', memberRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/', taskRouter);

export default router;
