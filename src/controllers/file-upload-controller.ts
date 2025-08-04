import { Request, Response, NextFunction } from 'express';
import { statusCode, errorMsg } from '../middlewares/error-handler';
import path from 'path';
import { randomUUID } from 'crypto';
import bucket from '../config/firebase-admin';

export const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;

    if (!file) {
      throw { status: statusCode.badRequest, message: errorMsg.wrongRequestFormat };
    }

    const { originalname, buffer, mimetype } = file;
    const ext = path.extname(originalname);
    const baseName = path.basename(originalname, ext);
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const firebaseFileName = `${safeBaseName}_${timestamp}_${randomUUID()}${ext}`;
    const destination = `files/${firebaseFileName}`;

    // 파이어베이스에 업로드
    const fileRef = bucket.file(destination);
    await fileRef.save(buffer, {
      metadata: { contentType: mimetype },
    });

    // 서명 URL 생성
    const url = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    // URL만 응답
    return res.status(200).json({ imageUrl: url[0] });
  } catch (error) {
    next(error);
  }
};
