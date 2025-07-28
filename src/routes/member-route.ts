import { Router } from 'express';
import { getProjectMembers } from '../controllers/member-controller';
import { addMockUser } from '../middlewares/add-mock-user';

const router = Router();

// 인증 미들웨어 추가 예정
// router.get('/projects/:projectId/users', addMockUser, getProjectMembers);

export default router;
