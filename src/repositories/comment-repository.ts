import db from '../config/db';

export const commentRepository = {
  async getCommentById(commentId: number) {
    return await db.comments.findUnique({
      where: { id: commentId },
      include: {
        author: true,
        task: {
          select: { projectId: true },
        },
      },
    });
  },

  async checkProjectMember(projectId: number, userId: number) {
    const member = await db.project_members.findFirst({
      where: { projectId, userId },
    });

    return Boolean(member);
  },
};
