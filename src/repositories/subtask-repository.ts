import db from '../config/db';
import { Prisma } from '@prisma/client';

export const subtaskRepository = {
  // subtask 생성
  create: (data: Prisma.SubtasksUncheckedCreateInput) => db.subtasks.create({ data }),

  // subtaskId로 하위 할 일 세부조회 API 명세서에는 있지만 프론트에서 사용되지 않음, update와 delete는 사용됨

  findBySubTaskId: (id: number) => db.subtasks.findUnique({ where: { id } }),

  // subtask 목록 조회

  findManyByTaskId: async (taskId: number, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      db.subtasks.findMany({
        where: { taskId },
        skip,
        take: limit,
        select: {
          id: true,
          taskId: true,
          description: true,
          isDone: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      }),
      db.subtasks.count({
        where: { taskId },
      }),
    ]);

    return { data, total };
  },
  update: (id: number, data: Prisma.SubtasksUncheckedUpdateInput) =>
    db.subtasks.update({ where: { id }, data }),
  delete: (id: number) => db.subtasks.delete({ where: { id } }),
};
