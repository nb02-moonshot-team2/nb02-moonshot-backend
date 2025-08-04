import { Response, NextFunction } from 'express';
import { commentService } from '../services/comment-service';
import { AuthenticateRequest } from '../utils/dtos/member-dto';
import { handleError, statusCode, errorMsg } from '../middlewares/error-handler';

export const getCommentById = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = req.user?.id;

    if (!commentId || isNaN(commentId)) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!userId) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const comment = await commentService.getCommentById(commentId, userId);
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
