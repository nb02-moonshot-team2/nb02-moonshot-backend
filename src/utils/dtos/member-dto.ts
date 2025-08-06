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

// 따로 확장하지 않고 전역 선언된 user 사용하기 위해 기존 인터페이스 삭제
export type AuthenticateRequest = Request;

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
