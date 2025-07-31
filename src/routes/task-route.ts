import { Router } from 'express';
import { createTaskController, getAllTasksController } from '../controllers/task-controller';

const router = Router();

router.route('/projects/:projectId/tasks').post(createTaskController).get(getAllTasksController);

export default router;
