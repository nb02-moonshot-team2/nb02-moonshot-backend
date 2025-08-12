import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index-route';
import passport from './utils/passport/index';

import { useSwagger } from './config/swagger';

import { errorHandler } from './middlewares/error-handler';

const app = express();

// 미들웨어 설정
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// render 헬스 체크용
app.get('/health', (req, res) => res.status(200).send('OK'));

// 라우터 등록
app.use('/', routes);

// 스웨거 사용
useSwagger(app);

// 에러 미들웨어 등록
app.use(errorHandler);

export default app;
