import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error-moddleware';

import routes from './routes/index-route';

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

// 에러 미들웨어 등록
app.use(errorMiddleware);

export default app;
