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

export const updateComment = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user?.id;
    const { content } = req.body;

    if (isNaN(commentId)) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!userId) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    const updatedComment = await commentService.updateComment(commentId, userId, content);
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user?.id;

    if (isNaN(commentId)) {
      return handleError(next, null, errorMsg.wrongRequestFormat, statusCode.badRequest);
    }

    if (!userId) {
      return handleError(next, null, errorMsg.loginRequired, statusCode.unauthorized);
    }

    await commentService.deleteComment(commentId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
