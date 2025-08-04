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

  async updateComment(commentId: number, content: string) {
    return await db.comments.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  },
};
