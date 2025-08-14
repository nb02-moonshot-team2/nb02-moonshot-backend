import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index-route';
import passport from './utils/passport/index';

import { useSwagger } from './config/swagger';

import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://nb-02-moon-shot-fe.vercel.app'],
    credentials: true,
  })
);

// 프록시(HTTPS 뒤)에서 secure 쿠키 허용
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Render 헬스체크 (설정의 경로와 동일하게)
app.get('/health', (_req, res) => res.status(200).send('OK'));

// 라우터
app.use('/', routes);

// Swagger
useSwagger(app);

// 에러 핸들러
app.use(errorHandler);

export default app;
