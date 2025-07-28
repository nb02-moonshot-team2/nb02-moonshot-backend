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
<<<<<<< HEAD

export interface InviteMember {
  email: string;
}
=======
>>>>>>> 1daebffdab2725e2bdaacdba2d41220d2b656c9f
