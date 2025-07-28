import { Router } from 'express';
import {
  getProjectMembers,
  inviteMember,
  acceptInvitation,
  deleteInvitation,
} from '../controllers/member-controller';
import { addMockUser } from '../middlewares/add-mock-user';

const router = Router();

// 프로젝트 멤버 조회
router.get('/projects/:projectId/users', addMockUser, getProjectMembers);

// 프로젝트에 멤버 초대
router.post('/projects/:projectId/invitations', inviteMember);

// 멤버 초대 수락
router.post('/invitations/:invitationId/accept', acceptInvitation);

// 멤버 초대 삭제
router.delete('/invitations/:invitationId', deleteInvitation);

export default router;
