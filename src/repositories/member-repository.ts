import prisma from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export const memberRepository = {
  async getProjectMembers(
    projectId: number,
    skip: number,
    take: number
  ): Promise<{
    creator: {
      id: number;
      name: string;
      email: string;
      profileImage: string;
    };
    creatorId: number;
    members: {
      id: number;
      status: 'pending' | 'accepted' | 'rejected';
      invitee: {
        id: number;
        name: string;
        email: string;
        profileImage: string;
      };
    }[];
    total: number;
  }> {
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      include: { creator: true },
    });

    if (!project) throw new Error('Project not found');

    const members = await prisma.invitations.findMany({
      where: { projectId },
      include: { invitee: true },
      skip,
      take,
    });

    const total = await prisma.invitations.count({
      where: { projectId },
    });

    return {
      creator: {
        id: project.creator.id,
        name: project.creator.name,
        email: project.creator.email,
        profileImage: project.creator.profileImage,
      },
      creatorId: project.creatorId,
      members,
      total: total + 1, // creator 포함
    };
  },

  async getTaskCount(projectId: number, userId: number) {
    return await prisma.tasks.count({
      where: { projectId, userId },
    });
  },

  async findProjectById(projectId: number) {
    return await prisma.projects.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
  },

  async checkProjectAdmin(projectId: number, mockUserId: number): Promise<boolean> {
    const propject = await prisma.projects.findFirst({
      where: {
        id: projectId,
        creatorId: mockUserId,
      },
    });
    return !!propject;
  },

  async isProjectMember(projectId: number, userId: number) {
    const member = await prisma.project_members.findFirst({
      where: { projectId, userId },
    });
    return Boolean(member);
  },

  async removeProjectMember(projectId: number, targetUserId: number): Promise<void> {
    await prisma.project_members.deleteMany({
      where: {
        projectId,
        userId: targetUserId,
      },
    });
  },

  async isProjectOwner(projectId: number, userId: number) {
    const project = await prisma.projects.findFirst({
      where: {
        id: projectId,
        creatorId: userId,
      },
    });
    return Boolean(project);
  },

  async findUserByEmail(email: string) {
    return await prisma.users.findUnique({
      where: { email },
    });
  },

  async createInvitation(projectId: number, invitorId: number, inviteeId: number) {
    const token = uuidv4();

    return await prisma.invitations.create({
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
    return prisma.invitations.findUnique({
      where: { id: invitationId },
    });
  },

  // 멤버 초대 수락 후 Project_members 테이블 업데이트 : 트랜잭션 처리
  async acceptInvitationWithMemberJoin(invitationId: number, projectId: number, userId: number) {
    return await prisma.$transaction(async (tx) => {
      // 초대 상태 변경
      await tx.invitations.update({
        where: { id: invitationId },
        data: {
          status: 'accepted',
          acceptedAt: new Date(),
        },
      });

      // 프로젝트 멤버 등록 (중복 방지)
      const existing = await tx.project_members.findFirst({
        where: { projectId, userId },
      });

      if (!existing) {
        await tx.project_members.create({
          data: { projectId, userId },
        });
      }
    });
  },

  async deleteInvitation(invitationId: number) {
    return prisma.invitations.delete({
      where: { id: invitationId },
    });
  },
};
