import { NextFunction, Request, Response } from 'express';
import { memberService } from '../services/member-service';
<<<<<<< HEAD
import { InviteMember } from '../utils/dtos/member-dto';
import { handleError, statusCode, errorMsg } from '../utils/error';

// 유저 추론 타입을 위해 임의 작성
=======
import { errorMessages } from '../constants/error-messages';

>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f
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

<<<<<<< HEAD
// mock user 주입 (인증 로직 대체)
const mockUserId = 1;

// 프로젝트 멤버 조회
=======
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f
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
<<<<<<< HEAD
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
=======
      return res.status(400).json({ message: errorMessages.badRequest });
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f
    }

    // 로그인 여부 확인 (401 처리)
    if (!req.user?.id) {
<<<<<<< HEAD
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
=======
      return res.status(401).json({ message: errorMessages.unauthorized });
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f
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
<<<<<<< HEAD

export const inviteMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const { email }: InviteMember = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    if (!email || isNaN(projectId) || !userId) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    const { invitationId } = await memberService.inviteMember(userId, projectId, {
      email,
    });

    return res.status(201).json({ invitationId });
  } catch (error) {
    const err = error as { status?: number; message?: string };

    if (err.status && err.message) {
      return res.status(err.status).json({ message: err.message });
    }
    next(error);
  }
};

// 멤버 초대 수락
export const acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invitationId = Number(req.params.invitationId);

    if (isNaN(invitationId)) {
      return handleError(next, null, errorMsg.dataNotFound, statusCode.notFound);
    }

    const result = await memberService.acceptInvitation({
      invitationId,
      userId: mockUserId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
=======
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f
