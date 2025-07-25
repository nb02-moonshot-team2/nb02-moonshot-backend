import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error-moddleware';

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT;

// 에러 미들웨어 등록
app.use(errorHandler);

export default app;
