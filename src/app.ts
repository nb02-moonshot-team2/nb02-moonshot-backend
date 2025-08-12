import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index-route';
import passport from './utils/passport/index';

import { useSwagger } from './config/swagger';

import { errorHandler } from './middlewares/error-handler';

const app = express();

// ---- 필수 env 체크(프로덕션) ----
if (process.env.NODE_ENV === 'production') {
  const required = ['FRONTEND_URL'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required env(s): ${missing.join(', ')}`);
  }
}

// ---- CORS 허용 목록 구성 ----
const prodFe = process.env.FRONTEND_URL ?? '';

const previewFeList = (process.env.FRONTEND_PREVIEWS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const localList = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const allowList = new Set([prodFe, ...previewFeList, ...localList].filter(Boolean));

app.use(
  cors({
    origin: (origin, cb) => {
      // 서버-서버/헬스체크 등 Origin 없음은 허용
      if (!origin) return cb(null, true);

      // 정확히 일치하는 도메인만 허용 (endsWith('.vercel.app')는 지양)
      if (allowList.has(origin)) return cb(null, true);

      cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// 프록시(HTTPS 뒤)에서 secure 쿠키 허용
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Render 헬스체크 (설정의 경로와 동일하게)
app.get('/health', (_req, res) => res.status(200).send('OK'));

// 라우터
app.use('/', routes);

// Swagger
useSwagger(app);

// 에러 핸들러
app.use(errorHandler);

export default app;
