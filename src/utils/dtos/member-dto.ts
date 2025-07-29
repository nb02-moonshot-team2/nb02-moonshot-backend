import { Request } from 'express';

export interface ProjectMemberResponse {
  id: number;
  name: string;
  email: string;
  profileImage: string;
  taskCount: number;
  status: 'pending' | 'accepted' | 'rejected';
  invitationId: number;
}

export interface AuthenticateRequest extends Request {
  user?: {
    id: number;
    email: string;
    nickname: string;
    password: string;
    image: string | null;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface GetProjectMembersQuery {
  page: number;
  limit: number;
}

export interface InviteMember {
  email: string;
}

export interface AcceptInvitationParams {
  invitationId: number;
  userId: number;
}
