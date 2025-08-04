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
};
