import {
  ProjectMemberResponse,
  GetProjectMembersQuery,
  InviteMember,
} from '../utils/dtos/member-dto';
import { memberRepository } from '../repositories/member-repository';
import { statusCode, errorMsg } from '../utils/error';

interface AcceptInvitationParams {
  invitationId: number;
  userId: number;
}

export const memberService = {
  // 프로젝트 멤버 조회
  async getProjectMembers(
    projectId: number,
    query: GetProjectMembersQuery,
    userId?: number
  ): Promise<{ data: ProjectMemberResponse[]; total: number }> {
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
    const { members, total } = await memberRepository.getProjectMembers(
      projectId,
      skip,
      query.limit
    );

    if (!members || members.length === 0) {
      throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    }

    const data: ProjectMemberResponse[] = await Promise.all(
      members.map(async (member) => {
        const { id, name, email, profileImage } = member.user;

        const taskCount = await memberRepository.getTaskCount(projectId, id);
        const invitation = await memberRepository.getInviationStatus(projectId, id);

        return {
          id,
          name,
          email,
          profileImage,
          taskCount,
          status: invitation?.status ?? 'accepted',
          invitationId: invitation?.id ?? 0,
        };
      })
    );

    return { data, total };
  },

  // 프로젝트에서 유저 제외하기
  async removeProjectMember(projectId: number, userId: number): Promise<void> {
    if (!userId || isNaN(userId))
      throw { status: statusCode.unauthorized, message: errorMsg.loginRequired };

    // 프로젝트 확인
    const project = await memberRepository.findProjectById(projectId);
    if (!project) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    // 관리자 권한 확인
    const isAdmin = await memberRepository.checkProjectAdmin(projectId, userId);
    if (!isAdmin) throw { status: statusCode.forbidden, message: errorMsg.accessDenied };

    // 본인 제외 불가
    if (userId === userId) {
      throw { status: statusCode.badRequest, message: errorMsg.wrongRequestFormat };
    }

    // 삭제 대상 유저가 실제 프로젝트 멤버인지 확인
    const isMember = await memberRepository.isProjectMember(projectId, userId);
    if (!isMember) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    await memberRepository.removeProjectMember(projectId, userId);
  },

  // 프로젝트 멤버 초대
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

  // 멤버 초대 수락
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

    await memberRepository.acceptInvitation(invitationId);
    return { message: '초대 수락 완료' };
  },

  // 멤버 초대 삭제
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

    // 삭제 권한: 초대한 사람(inviterId)만 가능
    console.log('invitation.invitorId:', invitation.invitorId);
    console.log('userId:', userId);
    if (invitation.invitorId !== userId) {
      throw {
        status: statusCode.forbidden,
        message: errorMsg.accessDenied,
      };
    }

    await memberRepository.deleteInvitation(invitationId);
  },
};
