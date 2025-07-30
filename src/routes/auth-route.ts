import express from 'express';
import AuthController from '../controllers/auth-controllers';
import passport from '../utils/passport/index';
const authController = new AuthController();
const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);
// jwt 전략 테스트용 api 추후 삭제 예정
authRouter.get(
  '/test',
  passport.authenticate('access-token', { session: false }),
  authController.test
);
authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);
export default authRouter;
