import {
  ProjectMemberResponse,
  GetProjectMembersResponse,
  GetProjectMembersQuery,
  InviteMember,
  AcceptInvitationParams,
} from '../utils/dtos/member-dto';
import { statusCode, errorMsg } from '../middlewares/error-handler';
import { memberRepository } from '../repositories/member-repository';

export const memberService = {
  async getProjectMembers(
    projectId: number,
    query: GetProjectMembersQuery,
    userId?: number
  ): Promise<GetProjectMembersResponse> {
    const project = await memberRepository.findProjectById(projectId);
    if (!project) {
      throw { status: statusCode.notFound, message: errorMsg.projectNotFound };
    }

    if (userId) {
      const isMember = await memberRepository.isProjectMember(projectId, userId);
      if (!isMember) {
        throw { status: statusCode.forbidden, message: errorMsg.accessDenied };
      }
    }

    const skip = (query.page - 1) * query.limit;
    const { creator, creatorId, members, total } = await memberRepository.getProjectMembers(
      projectId,
      skip,
      query.limit
    );

    const creatorTaskCount = await memberRepository.getTaskCount(projectId, creator.id);

    const creatorDto: ProjectMemberResponse = {
      id: creator.id,
      name: creator.name,
      email: creator.email,
      profileImage: creator.profileImage,
      taskCount: creatorTaskCount,
      status: 'accepted', // 생성자는 따로 초대 status 없음
      invitationId: null,
    };

    const memberDtos: ProjectMemberResponse[] = await Promise.all(
      members
        .filter((m) => m.invitee.id !== creatorId)
        .map(async (member) => {
          const { id, name, email, profileImage } = member.invitee;
          const taskCount = await memberRepository.getTaskCount(projectId, id);

          return {
            id,
            name,
            email,
            profileImage,
            taskCount,
            status: member.status,
            invitationId: member.invitationId ?? null,
          };
        })


    );

    return {
      data: [creatorDto, ...memberDtos],
      total,
      creatorId,
    };
  },

  async removeProjectMember(
    projectId: number,
    targetUserId: number,
    requestUserId: number
  ): Promise<void> {
    if (!requestUserId || isNaN(requestUserId)) {
      throw { status: statusCode.unauthorized, message: errorMsg.loginRequired };
    }

    const project = await memberRepository.findProjectById(projectId);
    if (!project) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    const isAdmin = await memberRepository.checkProjectAdmin(projectId, requestUserId);
    if (!isAdmin) throw { status: statusCode.forbidden, message: errorMsg.accessDenied };

    if (targetUserId === project.creatorId) {
      throw { status: statusCode.badRequest, message: '프로젝트 생성자는 제외할 수 없습니다.' };
    }

    if (requestUserId === targetUserId) {
      throw { status: statusCode.badRequest, message: errorMsg.wrongRequestFormat };
    }

    const [isMember, hasPending] = await Promise.all([
      memberRepository.isProjectMember(projectId, targetUserId),
      memberRepository.hasPendingInvite(projectId, targetUserId),
    ]);

    if (!isMember && !hasPending) {
      throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    }

    await memberRepository.removeProjectMember(projectId, targetUserId);
  },

  async inviteMember(
    invitorId: number,
    projectId: number,
    dto: InviteMember
  ): Promise<{ invitationId: string }> {
    const project = await memberRepository.findProjectById(projectId);
    if (!project) {
      throw { status: statusCode.badRequest, message: errorMsg.wrongRequestFormat };
    }

    const isAdmin = await memberRepository.isProjectOwner(projectId, invitorId);
    if (!isAdmin) {
      throw { status: statusCode.forbidden, message: errorMsg.accessDenied };
    }

    const invitee = await memberRepository.findUserByEmail(dto.email);
    if (!invitee) {
      throw { status: statusCode.badRequest, message: errorMsg.wrongRequestFormat };
    }

    const invitation = await memberRepository.createInvitation(projectId, invitorId, invitee.id);

    return { invitationId: invitation.token };
  },

  async acceptInvitation({
    invitationId,
    userId,
  }: AcceptInvitationParams): Promise<{ message: string }> {
    const invitation = await memberRepository.findInvitationById(invitationId);

    if (!invitation) {
      throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    }

    if (invitation.inviteeId !== userId) {
      throw { status: statusCode.forbidden, message: errorMsg.accessDenied };
    }

    if (invitation.acceptedAt !== null) {
      throw { status: statusCode.badRequest, message: '이미 수락된 초대입니다.' };
    }

    // 트랜잭션으로 초대 수락 + 멤버 등록 처리
    await memberRepository.acceptInvitationWithMemberJoin(
      invitationId,
      invitation.projectId,
      userId
    );

    return { message: '초대 수락 완료' };
  },

  async deleteInvitation({
    invitationId,
    userId,
  }: {
    invitationId: number;
    userId: number;
  }): Promise<void> {
    const invitation = await memberRepository.findInvitationById(invitationId);

    if (!invitation) {
      throw {
        status: statusCode.notFound,
        message: errorMsg.dataNotFound,
      };
    }

    if (invitation.invitorId !== userId) {
      throw {
        status: statusCode.forbidden,
        message: errorMsg.accessDenied,
      };
    }

    await memberRepository.deleteInvitation(invitationId);
  },

  async getMyInvitations({
    userId,
    status,
    page,
    limit,
  }: {
    userId: number;
    status: 'pending' | 'accepted' | 'rejected' | 'all';
    page: number;
    limit: number;
  }): Promise<{
    data: Array<{
      id: number;
      status: 'pending' | 'accepted' | 'rejected';
      projectId: number;
      invitedAt: Date;
      project: { id: number; name: string; description: string | null };
    }>;
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const filterStatus = status === 'all' ? undefined : status;
    const { data, total } = await memberRepository.findInvitationsByInvitee(
      userId,
      filterStatus,
      skip,
      limit
    );
    return { data, total };
  },

  async rejectInvitation({
    invitationId,
    userId,
  }: {
    invitationId: number;
    userId: number;
  }): Promise<{ message: string }> {
    const invitation = await memberRepository.findInvitationById(invitationId);

    if (!invitation) {
      throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    }

    // 본인 초대만 거절 가능
    if (invitation.inviteeId !== userId) {
      throw { status: statusCode.forbidden, message: errorMsg.accessDenied };
    }

    if (invitation.status === 'accepted') {
      throw { status: statusCode.badRequest, message: '이미 수락된 초대입니다.' };
    }
    if (invitation.status === 'rejected') {
      throw { status: statusCode.badRequest, message: '이미 거절된 초대입니다.' };
    }

    await memberRepository.rejectInvitation(invitationId);
    return { message: '초대 거절 완료' };
  },
};
