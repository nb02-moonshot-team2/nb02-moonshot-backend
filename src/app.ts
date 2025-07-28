import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error-moddleware';

<<<<<<< HEAD
import { errorHandler } from './utils/error';
import routes from './routes/index-route';

dotenv.config();
=======
import routes from './routes/index-route';
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f

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
<<<<<<< HEAD

// 에러 미들웨어
app.use(errorHandler);

const port = process.env.PORT;
=======
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f

// 에러 미들웨어 등록
app.use(errorHandler);

export default app;
