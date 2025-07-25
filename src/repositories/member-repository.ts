import db from '../config/db';

export const memberRepository = {
  async findProjectById(projectId: number) {
    return await db.projects.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
  },

  async isProjectMember(projectId: number, userId: number) {
    const member = await db.project_members.findFirst({
      where: { projectId, userId },
    });
    return Boolean(member);
  },

  async getProjectMembers(projectId: number, skip: number, take: number) {
    const members = await db.project_members.findMany({
      where: { projectId },
      include: { user: true },
      skip,
      take,
    });

    const total = await db.project_members.count({
      where: { projectId },
    });

    return { members, total };
  },

  async getTaskCount(projectId: number, userId: number) {
    return await db.tasks.count({
      where: { projectId, userId },
    });
  },

  async getInviationStatus(projectId: number, userId: number) {
    return await db.invitations.findFirst({
      where: { projectId, inviteeId: userId },
      select: { id: true, status: true },
    });
  },
};
