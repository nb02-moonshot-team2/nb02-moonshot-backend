export interface ProjectMemberResponse {
  id: number;
  name: string;
  email: string;
  profileImage: string;
  taskCount: number;
  status: 'pending' | 'accepted' | 'rejected';
  invitationId: number;
}

export interface GetProjectMembersQuery {
  page: number;
  limit: number;
}

export interface InviteMember {
  email: string;
}
