import { Router } from 'express';
import passport from '../utils/passport/index';
import {
  getProjectMembers,
  removeProjectMember,
  inviteMember,
  acceptInvitation,
  deleteInvitation,
} from '../controllers/member-controller';

const router = Router();

// 프로젝트 멤버 조회
router.get(
  '/projects/:projectId/users',
  passport.authenticate('access-token', { session: false }),
  getProjectMembers
);

// 프로젝트에서 유저 제외하기
router.delete(
  '/projects/:projectId/users/:userId',
  passport.authenticate('access-token', { session: false }),
  removeProjectMember
);

// 프로젝트에 멤버 초대
router.post(
  '/projects/:projectId/invitations',
  passport.authenticate('access-token', { session: false }),
  inviteMember
);

// 멤버 초대 수락
router.post(
  '/invitations/:invitationId/accept',
  passport.authenticate('access-token', { session: false }),
  acceptInvitation
);

// 멤버 초대 삭제
router.delete(
  '/invitations/:invitationId',
  passport.authenticate('access-token', { session: false }),
  deleteInvitation
);

export default router;
