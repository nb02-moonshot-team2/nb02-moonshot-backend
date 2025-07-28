import { NextFunction, Request, Response } from 'express';
import { memberService } from '../services/member-service';
import { InviteMember } from '../utils/dtos/member-dto';
import { handleError, statusCode, errorMsg } from '../utils/error';

// 유저 추론 타입을 위해 임의 작성
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

// mock user 주입 (인증 로직 대체)
const mockUserId = 1;

// 프로젝트 멤버 조회

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
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    // 로그인 여부 확인 (401 처리)
    if (!req.user?.id) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
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

// 멤버 초대 삭제
export const deleteInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invitationId = Number(req.params.invitationId);

    if (isNaN(invitationId)) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    await memberService.deleteInvitation({
      invitationId,
      userId: mockUserId,
    });

    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};
