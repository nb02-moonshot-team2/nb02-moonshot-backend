import { NextFunction, Request, Response } from 'express';
import { memberService } from '../services/member-service';

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

export const getProjectMembers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (isNaN(projectId)) {
      return res.status(400).json({ message: '올바르지 않은 프로젝트 ID 형식' });
    }

    // 토큰 미사용 중이라면 userId는 undefined
    const userId = req.user?.id;

    const result = await memberService.getProjectMembers(
      projectId,
      {
        page,
        limit,
      },
      userId
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
