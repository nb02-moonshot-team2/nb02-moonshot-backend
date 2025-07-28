<<<<<<< HEAD
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

=======
import { ProjectMemberResponse, GetProjectMembersQuery } from '../utils/dtos/member-dto';
import { memberRepository } from '../repositories/member-repository';
import { errorMessages } from '../constants/error-messages';

export const memberService = {
  async getProjectMembers(
    projectId: number,
    query: GetProjectMembersQuery,
    userId?: number // 현재 로그인된 사용자 (나중에 req.user.id로 전달 받을 예정)
  ): Promise<{ data: ProjectMemberResponse[]; total: number }> {
    // 프로젝트  확인
    const project = await memberRepository.findProjectById(projectId);
    if (!project) {
      throw {
        status: 400,
        message: errorMessages.badRequest,
      };
    }

    // 요청한 유저가 해당 프로젝트의 멤버인지 확인
    if (userId) {
      const isMember = await memberRepository.isProjectMember(projectId, userId);
      if (!isMember) {
        throw {
          status: 403,
          message: errorMessages.forbidden,
        };
      }
    }

    // 멤버 목록 조회
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f
    const skip = (query.page - 1) * query.limit;
    const { members, total } = await memberRepository.getProjectMembers(
      projectId,
      skip,
      query.limit
    );

    if (!members || members.length === 0) {
<<<<<<< HEAD
      throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
=======
      throw {
        status: 404,
        message: errorMessages.notFound,
      };
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f
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
<<<<<<< HEAD

    return { data, total };
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
=======
    return { data, total };
  },
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f
};
