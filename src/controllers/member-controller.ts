import { NextFunction, Request, Response } from 'express';
import { memberService } from '../services/member-service';
import { errorMessages } from '../constants/error-messages';

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

    // 프로젝트 확인
    if (isNaN(projectId)) {
      return res.status(400).json({ message: errorMessages.badRequest });
    }

    // 로그인 여부 확인 (401 처리)
    if (!req.user?.id) {
      return res.status(401).json({ message: errorMessages.unauthorized });
    }

    const userId = req.user.id;

    //
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
    const err = error as { status?: number; message?: string };

    if (err.status && err.message) {
      return res.status(err.status).json({ message: err.message });
    }
    next(error);
  }
};
