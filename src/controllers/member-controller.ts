import { NextFunction, Response } from 'express';
import { AuthenticateRequest, InviteMember } from '../utils/dtos/member-dto';
import { handleError, statusCode, errorMsg } from '../middlewares/error-handler';
import { memberService } from '../services/member-service';

// 프로젝트 멤버 조회
export const getProjectMembers = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (isNaN(projectId)) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!req.user?.id) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const userId = req.user.id;

    const result = await memberService.getProjectMembers(projectId, { page, limit }, userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 프로젝트에서 유저 제외하기
export const removeProjectMember = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = Number(req.params.projectId);
    const targetUserId = Number(req.params.userId);

    if (!req.user?.id) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const requestUserId = req.user.id;

    if (isNaN(projectId) || isNaN(targetUserId)) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    await memberService.removeProjectMember(projectId, targetUserId, requestUserId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// 프로젝트에 멤버 초대
export const inviteMember = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const { email }: InviteMember = req.body;

    if (!req.user?.id) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const userId = req.user.id;

    if (!email || isNaN(projectId)) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    const { invitationId } = await memberService.inviteMember(userId, projectId, { email });

    return res.status(201).json({ invitationId });
  } catch (error) {
    next(error);
  }
};

// 멤버 초대 수락
export const acceptInvitation = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const invitationId = Number(req.params.invitationId);

    if (!req.user?.id) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const userId = req.user.id;

    if (isNaN(invitationId)) {
      return handleError(next, null, errorMsg.dataNotFound, statusCode.notFound);
    }

    const result = await memberService.acceptInvitation({ invitationId, userId });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 멤버 초대 삭제
export const deleteInvitation = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const invitationId = Number(req.params.invitationId);

    if (!req.user?.id) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const userId = req.user.id;

    if (isNaN(invitationId)) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    await memberService.deleteInvitation({ invitationId, userId });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// 내가 받은 초대 목록 조회
export const getMyInvitations = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    // ?status=pending|accepted|rejected|all (default: pending)
    const status = (req.query.status as string) || 'pending';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const allowed = ['pending', 'accepted', 'rejected', 'all'];
    if (!allowed.includes(status) || page < 1 || limit < 1) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    const { data, total } = await memberService.getMyInvitations({
      userId: req.user?.id,
      status: status as 'pending' | 'accepted' | 'rejected' | 'all',
      page,
      limit,
    });
    console.log({ data, total });
    return res.status(200).json({ data, total });
  } catch (error) {
    next(error);
  }
};

//  멤버 초대 거절
export const rejectInvitation = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const invitationId = Number(req.params.invitationId);

    if (!req.user?.id) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    if (isNaN(invitationId)) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    const result = await memberService.rejectInvitation({
      invitationId,
      userId: req.user.id,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
