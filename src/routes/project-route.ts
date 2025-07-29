import { Router } from 'express';
import { createProject, getProject, updateProject } from '../controllers/project-controller';

const router = Router();

router.post('/', createProject);
router.get('/:projectId', getProject);
router.patch('/:projectId', updateProject);
// router.delete('/:projectId', deleteProject);

export default router;
