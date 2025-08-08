import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function authorization(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const projectId = Number(req.params.projectId);

  if (!userId) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  if (isNaN(projectId)) {
    return res.status(400).json({ message: '유효하지 않은 프로젝트 ID입니다.' });
  }

  try {
    const isMember = await prisma.project_members.findFirst({
      where: { projectId, userId },
    });

    if (!isMember) {
      return res.status(403).json({ message: '프로젝트 접근 권한이 없습니다.' });
    }

    next();
  } catch (error) {
    console.error('authorization error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}
