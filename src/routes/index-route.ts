import { Router } from 'express';
import memberRouter from './member-route';
import authRouter from './auth-route';
import taskRouter from './task-route';

const router = Router();

// router.use('/', memberRouter);
router.use('/auth', authRouter);
router.use('/', taskRouter);

export default router;
