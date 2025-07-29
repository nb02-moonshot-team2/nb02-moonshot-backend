import express from 'express';
import projectRouter from './routes/project-route';
import dotenv from 'dotenv';
import { errorHandler } from './utils/error';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/projects', projectRouter);

app.use(errorHandler);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
