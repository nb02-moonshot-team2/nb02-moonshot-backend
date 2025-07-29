import db from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export const memberRepository = {
  // 프로젝트 멤버 조회
  async getProjectMembers(projectId: number, skip: number, take: number) {
    const members = await db.invitations.findMany({
      where: { projectId, status: 'accepted' },
      include: { invitee: true },
      skip,
      take,
    });

    //  이 부분도 수정해야 할 것 같은데..total이 의미하는게 뭘까? 단순 프로젝트 수?
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

  async findProjectById(projectId: number) {
    return await db.projects.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
  },

  async checkProjectAdmin(projectId: number, mockUserId: number): Promise<boolean> {
    const propject = await db.projects.findFirst({
      where: {
        id: projectId,
        creatorId: mockUserId,
      },
    });
    return !!propject;
  },

  async isProjectMember(projectId: number, userId: number) {
    const member = await db.project_members.findFirst({
      where: { projectId, userId },
    });
    return Boolean(member);
  },

  async removeProjectMember(projectId: number, targetUserId: number): Promise<void> {
    await db.project_members.deleteMany({
      where: {
        projectId,
        userId: targetUserId,
      },
    });
  },

  async isProjectOwner(projectId: number, userId: number) {
    const project = await db.projects.findFirst({
      where: {
        id: projectId,
        creatorId: userId,
      },
    });
    return Boolean(project);
  },

  async findUserByEmail(email: string) {
    return await db.users.findUnique({
      where: { email },
    });
  },

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

  async findInvitationById(invitationId: number) {
    return db.invitations.findUnique({
      where: { id: invitationId },
    });
  },

  // 멤보 초대 수락
  async acceptInvitation(invitationId: number) {
    return db.invitations.update({
      where: { id: invitationId },
      data: { acceptedAt: new Date(), status: 'accepted' },
    });
  },

  // 멤버 초대 삭제
  async deleteInvitation(invitationId: number) {
    return db.invitations.delete({
      where: { id: invitationId },
    });
  },
};
