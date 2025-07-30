import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index-route';
import subtaskRouter from './routes/subtask-route';
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
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 라우터 등록
app.use('/', routes);
app.use('/subtasks', subtaskRouter);

// 에러 미들웨어 등록
app.use(errorHandler);

export default app;
