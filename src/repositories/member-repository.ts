import prisma from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export const memberRepository = {
  async getProjectMembers(
    projectId: number,
    skip: number,
    take: number
  ): Promise<{
    creator: { id: number; name: string; email: string; profileImage: string };
    creatorId: number;
    members: {
      status: 'pending' | 'accepted';
      invitationId: number | null;
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

    // accepted
    const acceptedMembers = await prisma.project_members.findMany({
      where: {
        projectId,
      },
      include: { user: true },
    });

    // pending
    const pendingInvites = await prisma.invitations.findMany({
      where: { projectId, status: 'pending' },
      include: { invitee: true },
    });

    // total
    const unified = [
      ...acceptedMembers.map((m) => ({
        status: 'accepted' as const,
        invitationId: null,
        invitee: {
          id: m.userId,
          name: m.user.name,
          email: m.user.email,
          profileImage: m.user.profileImage,
        },
      })),
      ...pendingInvites.map((i) => ({
        status: 'pending' as const,
        invitationId: i.id,
        invitee: {
          id: i.inviteeId,
          name: i.invitee.name,
          email: i.invitee.email,
          profileImage: i.invitee.profileImage,
        },
      })),
    ];

    // 페이지네이션
    const total = unified.length + 1;
    const start = Math.max(0, skip);
    const end = Math.min(unified.length, skip + take);
    const members = unified.slice(start, end);

    return {
      creator: {
        id: project.creator.id,
        name: project.creator.name,
        email: project.creator.email,
        profileImage: project.creator.profileImage,
      },
      creatorId: project.creatorId,
      members,
      total,
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
      select: { id: true, creatorId: true },
    });
  },

  async checkProjectAdmin(projectId: number, requestUserId: number): Promise<boolean> {
    const project = await prisma.projects.findFirst({
      where: {
        id: projectId,
        creatorId: requestUserId,
      },
    });
    return !!project;
  },

  async isProjectMember(projectId: number, userId: number) {
    const member = await prisma.project_members.findFirst({
      where: { projectId, userId },
    });
    return Boolean(member);
  },

  async removeProjectMember(projectId: number, targetUserId: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // accepted 제거
      await tx.project_members.deleteMany({
        where: { projectId, userId: targetUserId },
      });

      // pending 초대는 거절 처리로 변경
      await tx.invitations.updateMany({
        where: { projectId, inviteeId: targetUserId, status: 'pending' },
        data: { status: 'rejected' },
      });
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

  async findInvitationsByInvitee(
    inviteeId: number,
    status?: 'pending' | 'accepted' | 'rejected',
    skip = 0,
    take = 10
  ): Promise<{
    data: Array<{
      id: number;
      status: 'pending' | 'accepted' | 'rejected';
      projectId: number;
      invitedAt: Date;
      project: { id: number; name: string; description: string | null };
    }>;
    total: number;
  }> {
    const where = {
      inviteeId,
      ...(status ? { status } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.invitations.findMany({
        where,
        select: {
          id: true,
          status: true,
          projectId: true,
          invitedAt: true,
          project: { select: { id: true, name: true, description: true } },
        },
        orderBy: { invitedAt: 'desc' },
        skip,
        take,
      }),
      prisma.invitations.count({ where }),
    ]);

    return { data, total };
  },

  async rejectInvitation(invitationId: number) {
    return prisma.invitations.update({
      where: { id: invitationId },
      data: { status: 'rejected' },
    });
  },

  async hasPendingInvite(projectId: number, userId: number): Promise<boolean> {
    const pending = await prisma.invitations.findFirst({
      where: { projectId, inviteeId: userId, status: 'pending' },
      select: { id: true },
    });
    return !!pending;
  },

  // 필요하면 count가 필요한 경우도 제공 가능
  async countPendingInvites(projectId: number, userId: number): Promise<number> {
    return prisma.invitations.count({
      where: { projectId, inviteeId: userId, status: 'pending' },
    });
  },
};
