import express from 'express';
import AuthController from '../controllers/auth-controllers';
import passport from '../utils/jwtStrategy';
const authController = new AuthController();
const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);
// jwt 전략 테스트용 api 추후 삭제 예정
authRouter.get('/test', 
    passport.authenticate('access-token', { session: false }),
    authController.test);
// authRouter.post('/logout', authController.logout);

export default authRouter;