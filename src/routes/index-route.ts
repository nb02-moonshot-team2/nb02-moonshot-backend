import { Router } from 'express';
import memberRouter from './member-route';
import authRouter from './auth-route';
const router = Router();

// router.use('/', memberRouter);
router.use('/auth', authRouter);

export default router;
