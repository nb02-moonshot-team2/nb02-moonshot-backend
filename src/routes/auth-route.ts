import express from 'express';
import AuthController from '../controllers/auth-controllers';

const authController = new AuthController();
const authRouter = express.Router();

authRouter.post('/register', authController.register);

export default authRouter;