import multer from 'multer';

// 메모리에 저장
const upload = multer({
  storage: multer.memoryStorage(),
});
export default upload;
