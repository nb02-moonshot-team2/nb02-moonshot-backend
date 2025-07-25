import { ProjectMemberResponse, GetProjectMembersQuery } from '../utils/dtos/member-dto';
import { memberRepository } from '../repositories/member-repository';

export const memberService = {
  async getProjectMembers(
    projectId: number,
    query: GetProjectMembersQuery,
    userId?: number // 현재 로그인된 사용자 (나중에 req.user.id로 전달 받을 예정)
  ): Promise<{ data: ProjectMemberResponse[]; total: number }> {
    // 프로젝트 존재 확인
    const project = await memberRepository.findProjectById(projectId);
    if (!project) {
      throw {
        status: 404,
        message: '해당 프로젝트 없음',
      };
    }

    // 요청한 유저가 해당 프로젝트의 멤버인지 확인
    if (userId) {
      const isMember = await memberRepository.isProjectMember(projectId, userId);
      if (!isMember) {
        throw {
          status: 403,
          message: '프로젝트 멤버가 아님',
        };
      }
    }

    // 멤버 목록 조회
    const skip = (query.page - 1) * query.limit;
    const { members, total } = await memberRepository.getProjectMembers(
      projectId,
      skip,
      query.limit
    );

    if (!members || members.length === 0) {
      throw {
        status: 404,
        message: '해당 프로젝트 멤버 없음',
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
};
