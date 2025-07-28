import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error-moddleware';
import cookieParser from 'cookie-parser';
import routes from './routes/index-route';
import dotenv from 'dotenv';
import authRouter from './routes/auth-route';
dotenv.config();

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

// 라우터 등록
app.use('/', routes);
app.use(cookieParser());

// 에러 미들웨어 등록
app.use(errorHandler);

app.use('/auth', authRouter);

export default app;