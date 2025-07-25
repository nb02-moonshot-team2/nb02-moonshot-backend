import { Request, Response, NextFunction } from 'express';

// ✅ 확장된 Request 타입 정의
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    nickname: string;
    password: string;
    image: string | null;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

// ✅ 미들웨어에서 타입 적용
export const addMockUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  req.user = {
    id: 1,
    email: 'mockuser@test.com',
    nickname: 'mockuser',
    password: 'hashedpassword',
    image: null,
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  console.log('📥 컨트롤러에서 받은 req.user:', req.user);

  next();
};
