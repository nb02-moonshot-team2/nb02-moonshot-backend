import {
  ProjectMemberResponse,
  GetProjectMembersQuery,
  InviteMember,
} from '../utils/dtos/member-dto';
import { memberRepository } from '../repositories/member-repository';
import { errorMessages } from '../constants/error-messages';

export const memberService = {
  // 프로젝트 멤버 조회
  async getProjectMembers(
    projectId: number,
    query: GetProjectMembersQuery,
    userId?: number
  ): Promise<{ data: ProjectMemberResponse[]; total: number }> {
    const project = await memberRepository.findProjectById(projectId);
    if (!project) {
      throw {
        status: 400,
        message: errorMessages.badRequest,
      };
    }

    if (userId) {
      const isMember = await memberRepository.isProjectMember(projectId, userId);
      if (!isMember) {
        throw {
          status: 403,
          message: errorMessages.forbidden,
        };
      }
    }

    const skip = (query.page - 1) * query.limit;
    const { members, total } = await memberRepository.getProjectMembers(
      projectId,
      skip,
      query.limit
    );

    if (!members || members.length === 0) {
      throw {
        status: 404,
        message: errorMessages.notFound,
      };
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

  // 프로젝트 멤버 초대
  async inviteMember(
    invitorId: number,
    projectId: number,
    dto: InviteMember
  ): Promise<{ invitationId: string }> {
    const project = await memberRepository.findProjectById(projectId);
    if (!project) {
      throw {
        status: 400,
        message: errorMessages.badRequest,
      };
    }

    const isAdmin = await memberRepository.isProjectOwner(projectId, invitorId);
    if (!isAdmin) {
      throw {
        status: 403,
        message: '프로젝트 관리자가 아닙니다',
      };
    }

    const invitee = await memberRepository.findUserByEmail(dto.email);
    if (!invitee) {
      throw {
        status: 400,
        message: '존재하지 않는 사용자입니다',
      };
    }

    const invitation = await memberRepository.createInvitation(projectId, invitorId, invitee.id);

    return { invitationId: invitation.token };
  },
};
