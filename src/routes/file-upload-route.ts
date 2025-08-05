import { Router } from 'express';
import upload from '../middlewares/multer';
import { uploadFiles } from '../controllers/file-upload-controller';

const router = Router();

// 이미지 업로드
router.post('/', upload.single('file'), uploadFiles);

export default router;
