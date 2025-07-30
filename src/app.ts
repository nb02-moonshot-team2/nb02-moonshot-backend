import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index-route';
import dotenv from 'dotenv';
import passport from 'passport';
import subtaskRouter from './routes/subtask-route';
import { errorHandler } from './middlewares/error-handler';
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
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// 라우터 등록
app.use('/', routes);
app.use('/subtasks', subtaskRouter);

// 에러 미들웨어 등록
app.use(errorHandler);

export default app;
