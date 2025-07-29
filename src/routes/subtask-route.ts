import express from 'express';
import { updateSubtask, deleteSubtask } from '../controllers/subtask-controller';

const router = express.Router();

// 하위 할 일 세부조회는 frontend에 없음, 하위 할 일 생성은 taskRoute에서 합칠 예정

// router.get('/:subtaskId', getDetail);
router.patch('/:subtaskId', updateSubtask);
router.delete('/:subtaskId', deleteSubtask);

export default router;
