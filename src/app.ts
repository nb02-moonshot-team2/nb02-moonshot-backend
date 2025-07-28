import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth-route';
import errorHandler from './middlewares/error-handler';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT;

app.use('/auth', authRouter);

// 에러 핸들러 등록
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
