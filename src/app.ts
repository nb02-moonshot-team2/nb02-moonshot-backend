import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth-route';

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT;

app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
