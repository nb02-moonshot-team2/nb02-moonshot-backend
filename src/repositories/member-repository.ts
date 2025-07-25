import db from '../config/db';
import { v4 as uuidv4 } from 'uuid';

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

  // 프로젝트 소유자 확인
  async isProjectOwner(projectId: number, userId: number) {
    const project = await db.projects.findFirst({
      where: {
        id: projectId,
        creatorId: userId,
      },
    });
    return Boolean(project);
  },

  // 이메일로 사용자 조회
  async findUserByEmail(email: string) {
    return await db.users.findUnique({
      where: { email },
    });
  },

  // 초대 생성
  async createInvitation(projectId: number, invitorId: number, inviteeId: number) {
    const token = uuidv4();

    return await db.invitations.create({
      data: {
        projectId,
        invitorId,
        inviteeId,
        token,
        status: 'pending',
      },
      select: { token: true },
    });
  },
};
