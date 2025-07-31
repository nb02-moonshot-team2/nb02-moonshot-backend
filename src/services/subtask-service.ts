import { subtaskRepository } from '../repositories/subtask-repository';
import { Prisma } from '@prisma/client';
import { SubTaskData } from '../types/subtask-type';
import { statusCode, errorMsg } from '../middlewares/error-handler';
export const subtaskService = {
  createSubtask: async (userId: number, taskId: number, body: { description: string }) => {
    /* taskrepo에서 검증

    const task = await taskRepository.findByTaskId(taskId);
    if(!task) throw new CustomError(404,"NOT_FOUND")
    if(task.userId !== userId) throw new CustomError(403,"UNAUTHORIZED")

    */
    const { description } = body;
    const createSubtask = await subtaskRepository.create({ userId, taskId, description });
    return {
      id: createSubtask.id,
      title: createSubtask.description,
      taskId: createSubtask.taskId,
      status: createSubtask.isDone ? 'done' : 'todo',
      createdAt: createSubtask.createdAt,
      updatedAt: createSubtask.updatedAt,
    };
  },

  getListSubtasks: async (userId: number, taskId: number, page: number, limit: number) => {
    const { data, total }: { data: SubTaskData[]; total: number } =
      await subtaskRepository.findManyByTaskId(taskId, page, limit);
    if (total === 0) {
      return { data: [], total: 0 };
    }
    const filtered = data.filter((subtask) => subtask.userId === userId);
    if (filtered.length === 0) {
      throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    }
    const transformed = filtered.map((subtask) => ({
      id: subtask.id,
      title: subtask.description,
      taskId: subtask.taskId,
      status: subtask.isDone ? 'done' : 'todo',
      createdAt: subtask.createdAt,
      updatedAt: subtask.updatedAt,
    }));
    return { data: transformed, total };
  },

  /* 
  API명세서에는 있지만 프론트에서 기능 구현되지 않음

  getDetail: async (userId: number, subTaskId: number) => {
    const subtask = await subtaskRepository.findByTaskId(subTaskId);
    if (!subtask) throw new CustomError(404, 'NOT_FOUND');
    if (subtask.userId !== userId) throw new CustomError(403, "프로젝트 멤버가 아닙니다");
    return subtask;
  },
  */

  updateSubtask: async (userId: number, subTaskId: number, data: Prisma.SubtasksUpdateInput) => {
    const subtask = await subtaskRepository.findBySubTaskId(subTaskId);
    if (!subtask) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    if (subtask.userId !== userId)
      throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    const updated = await subtaskRepository.update(subTaskId, data);
    return {
      id: updated.id,
      title: updated.description,
      taskId: updated.taskId,
      status: updated.isDone ? 'done' : 'todo',
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },

  deleteSubtask: async (userId: number, subTaskId: number) => {
    const subtask = await subtaskRepository.findBySubTaskId(subTaskId);
    if (!subtask) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    if (subtask.userId !== userId)
      throw { status: statusCode.notFound, message: errorMsg.dataNotFound };
    return await subtaskRepository.delete(subTaskId);
  },
};
