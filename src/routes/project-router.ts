import { Router } from 'express';
import { createProject, getProject } from '../controllers/project-controller';

const router = Router();

router.post('/', createProject);
router.get('/:projectId', getProject);

export default router;
