import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index-route';
import passport from 'passport';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middlewares/error-handler';

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API 문서',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // 타입스크립트 경로
};

const swaggerSpec = swaggerJsdoc(options);

// 미들웨어 설정
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// 라우터 등록
app.use('/', routes);

// ✅ Swagger 문서 등록
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// 에러 미들웨어 등록
app.use(errorHandler);

export default app;
