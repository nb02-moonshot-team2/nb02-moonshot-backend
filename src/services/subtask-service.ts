import { Prisma } from '@prisma/client';
import { SubTaskData, CreateSubtask } from '../types/subtask-type';
import { statusCode, errorMsg } from '../middlewares/error-handler';
import { taskRepository } from '../repositories/task-repository';
import { memberRepository } from '../repositories/member-repository';
import { subtaskRepository } from '../repositories/subtask-repository';
export const subtaskService = {
  // subtask 생성
  createSubtask: async (userId: number, taskId: number, body: CreateSubtask) => {
    //  taskrepo에서 검증

    const task = await taskRepository.findByTaskId(taskId);
    if (!task) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    // project 멤버인지 검증

    const isProjectMember = await memberRepository.isProjectMember(task.projectId, userId);
    if (!isProjectMember) throw { status: statusCode.forbidden, message: errorMsg.accessDenied };

    const { title } = body;
    const createSubtask = await subtaskRepository.create({ userId, taskId, description: title });
    return {
      id: createSubtask.id,
      title: createSubtask.description,
      taskId: createSubtask.taskId,
      status: createSubtask.isDone ? 'done' : 'todo',
      createdAt: createSubtask.createdAt,
      updatedAt: createSubtask.updatedAt,
    };
  },

  // subtaks 목록 조회

  getListSubtasks: async (userId: number, taskId: number, page: number, limit: number) => {
    // task repo에서 검증

    const task = await taskRepository.findByTaskId(taskId);
    if (!task) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    // project 멤버인지 검증

    const isProjectMember = await memberRepository.isProjectMember(task.projectId, userId);
    if (!isProjectMember) throw { status: statusCode.forbidden, message: errorMsg.accessDenied };
    const { data, total }: { data: SubTaskData[]; total: number } =
      await subtaskRepository.findManyByTaskId(taskId, page, limit);
    if (total === 0) {
      return { data: [], total: 0 };
    }
    const transformed = data.map((subtask) => ({
      id: subtask.id,
      title: subtask.description,
      taskId: subtask.taskId,
      status: subtask.isDone ? 'done' : 'todo',
      createdAt: subtask.createdAt,
      updatedAt: subtask.updatedAt,
    }));
    return { data: transformed, total };
  },

  // subtask 하위 할 일 조회 API 명세서(/subtasks/:subtaskId)에는 있지만 프론트에서 기능 구현되지 않음

  getDetail: async (userId: number, subTaskId: number) => {
    const subtask = await subtaskRepository.findBySubTaskId(subTaskId);
    if (!subtask) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    const task = await taskRepository.findByTaskId(subtask.taskId);
    if (!task) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    const isProjectMember = await memberRepository.isProjectMember(task.projectId, userId);
    if (!isProjectMember) throw { status: statusCode.forbidden, message: errorMsg.accessDenied };

    return {
      id: subtask.id,
      title: subtask.description,
      taskId: subtask.taskId,
      status: subtask.isDone ? 'done' : 'todo',
      createdAt: subtask.createdAt,
      updatedAt: subtask.updatedAt,
    };
  },

  // subtask 수정

  updateSubtask: async (userId: number, subTaskId: number, data: Prisma.SubtasksUpdateInput) => {
    const subtask = await subtaskRepository.findBySubTaskId(subTaskId);
    if (!subtask) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    const task = await taskRepository.findByTaskId(subtask.taskId);
    if (!task) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    const isProjectMember = await memberRepository.isProjectMember(task.projectId, userId);
    if (!isProjectMember) throw { status: statusCode.forbidden, message: errorMsg.accessDenied };

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

  // subtaks 삭제

  deleteSubtask: async (userId: number, subTaskId: number) => {
    const subtask = await subtaskRepository.findBySubTaskId(subTaskId);
    if (!subtask) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    const task = await taskRepository.findByTaskId(subtask.taskId);
    if (!task) throw { status: statusCode.notFound, message: errorMsg.dataNotFound };

    const isProjectMember = await memberRepository.isProjectMember(task.projectId, userId);
    if (!isProjectMember) throw { status: statusCode.forbidden, message: errorMsg.accessDenied };
    return await subtaskRepository.delete(subTaskId);
  },
};
