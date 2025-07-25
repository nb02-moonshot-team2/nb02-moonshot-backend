import express from 'express';
import dotenv from 'dotenv';

import routes from './routes/index-route';

dotenv.config();

const app = express();

app.use(express.json());

// 라우터 등록
app.use('/', routes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
