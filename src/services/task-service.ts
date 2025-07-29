import { taskRepository } from '../repositories/task-repository';
import { CreateTaskRequest, CreateTaskResponse, GetAllTaskQuery, GetAllTasksResponse } from '../utils/dtos/task-dto';
import { handleError, errorMsg, statusCode } from '../middlewares/error-handler';



export const taskService = {
  async createTasks(
    projectId: number,
    userId: number,
    taskData: CreateTaskRequest,
  ): Promise<CreateTaskResponse> {
    const {
      title,
      description = '',
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay,
      status,
      tags = [],
      attachments = [],
    } = taskData;

    // todo: 서비스 파일에서 에러 핸들링을 할 수 있게 리펙토링

    // const project = await taskRepository.findProjectById(projectId);
    // if (!project) {
    //   return handleError(next, Error, errorMsg.badRequest, statusCode.badRequest);
    // }

    // const isMember = await taskRepository.isProjectMember(projectId, userId);
    // if (!isMember) {
    //   return handleError(next, Error, errorMsg.forbidden, statusCode.forbidden);
    // }

    const startedAt = new Date(startYear, startMonth - 1, startDay);
    const dueDate = new Date(endYear, endMonth - 1, endDay);

    const newTask = await taskRepository.createTasks({
      projectId,
      userId,
      title,
      description,
      status,
      startedAt,
      dueDate,
      tags,
      attachments: attachments.map((url) => ({
        name: url.split('/').pop() || 'file',
        url,
      })),
    });

    // 응답 가공
    return {
      id: newTask.id,
      projectId: newTask.projectId,
      title: newTask.title,
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay,
      status: newTask.status,
      assignee: {
        id: newTask.user.id,
        name: newTask.user.name,
        email: newTask.user.email,
        profileImage: newTask.user.profileImage,
      },
      tags: newTask.taskTags.map(({ tag }) => ({
        id: tag.id,
        name: tag.tag
      })),
      attachments: newTask.taskFiles.map((file) => ({
        id: file.id,
        url: file.fileUrl
      })),
      createdAt: newTask.createdAt,
      updatedAt: newTask.updatedAt,
    }
  },

  async getAllTasks(filters: GetAllTaskQuery): Promise<{ data: GetAllTasksResponse[], total: number }> {
    const {
      projectId,
      userId,
      page,
      limit,
      status,
      assignee,
      keyword,
      order,
      orderBy,
    } = filters;

    const skip = (page - 1) * limit;

    const result = await taskRepository.getAllTasks({
      projectId: projectId,
      userId: userId,
      status: status,
      assignee: assignee,
      keyword: keyword,
      order: order,
      orderBy: orderBy,
      skip: skip,
      take: limit,
    });

    const taskList = result.tasks;
    const totalCount = result.total;



    const mappedTasks = taskList.map((task) => {
      const start = new Date(task.startedAt);
      const end = new Date(task.dueDate);

      // 응답 가공
      return {
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        startYear: start.getFullYear(),
        startMonth: start.getMonth() + 1,
        startDay: start.getDate(),
        endYear: end.getFullYear(),
        endMonth: end.getMonth() + 1,
        endDay: end.getDate(),
        status: task.status,
        assignee: {
          id: task.user.id,
          name: task.user.name,
          email: task.user.email,
          profileImage: task.user.profileImage,
        },
        tags: task.taskTags.map(({ tag }) => ({
          id: tag.id,
          name: tag.tag,
        })),
        attachments: task.taskFiles.map((file) => ({
          id: file.id,
          url: file.fileUrl,
        })),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }
    });

    return {
      data: mappedTasks,
      total: totalCount,
    };
  }
}