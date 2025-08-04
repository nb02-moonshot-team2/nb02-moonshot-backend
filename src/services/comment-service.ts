import { commentRepository } from '../repositories/comment-repository';
import { errorMsg, statusCode } from '../middlewares/error-handler';

export const commentService = {
  async getCommentById(commentId: number, userId: number) {
    const comment = await commentRepository.getCommentById(commentId);

    if (!comment) {
      throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    }

    const isMember = await commentRepository.checkProjectMember(comment.task.projectId, userId);
    if (!isMember) {
      throw { status: statusCode.forbidden, message: errorMsg.accessDenied };
    }

    const { id, content, taskId, author, createdAt, updatedAt } = comment;

    return {
      id,
      content,
      taskId,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        profileImage: author.profileImage,
      },
      createdAt,
      updatedAt,
    };
  },

  async updateComment(commentId: number, userId: number, content: string) {
    const existingComment = await commentRepository.getCommentById(commentId);

    if (!existingComment) {
      throw {
        status: statusCode.notFound,
        message: errorMsg.dataNotFound,
      };
    }

    if (existingComment.author.id !== userId) {
      throw {
        status: statusCode.forbidden,
        message: errorMsg.accessDenied,
      };
    }

    const updated = await commentRepository.updateComment(commentId, content);
    return {
      id: updated.id,
      content: updated.content,
      taskId: updated.taskId,
      author: {
        id: updated.author.id,
        name: updated.author.name,
        email: updated.author.email,
        profileImage: updated.author.profileImage,
      },
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },
};
