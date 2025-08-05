import db from '../config/db';
import { Prisma } from '@prisma/client';
import { CreateTaskInput, GetAllTaskfilter, UpdateTaskInput } from '../utils/dtos/task-dto';
import { CreateCommentRequest } from '../utils/dtos/comment-dto';

export const taskRepository = {
  // subtask service에 사용
  async findByTaskId(taskId: number) {
    return await db.tasks.findUnique({
      where: { id: taskId },
    });
  },

  async findProjectById(projectId: number) {
    return await db.projects.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
  },

  async isProjectMember(projectId: number, userId: number) {
    return await db.project_members.findFirst({
      where: { projectId, userId },
    });
  },

  async getProjectIdOfTask(taskId: number) {
    return await db.tasks.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    });
  },

  async createTasks(data: CreateTaskInput) {
    const { projectId, userId, title, description, status, startedAt, dueDate, tags, attachments } =
      data;

    return await db.tasks.create({
      data: {
        projectId,
        userId,
        title,
        description,
        status,
        startedAt,
        dueDate,
        taskTags: {
          create: (tags ?? []).map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { tag: tagName },
                create: { tag: tagName },
              },
            },
          })),
        },
        taskFiles: {
          create: (attachments ?? []).map((file) => ({
            fileName: file.name,
            fileUrl: file.url,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        taskTags: {
          include: {
            tag: true,
          },
        },
        taskFiles: true,
      },
    });
  },

  async getAllTasks(filters: GetAllTaskfilter) {
    const where: Prisma.TasksWhereInput = {
      projectId: filters.projectId,
    };

    if (filters.assignee) {
      where.userId = filters.assignee;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.keyword && filters.keyword.trim() !== '') {
      where.title = {
        contains: filters.keyword,
        mode: 'insensitive',
      };
    }

    const tasks = await db.tasks.findMany({
      where: where,
      skip: filters.skip,
      take: filters.take,
      orderBy: {
        [filters.orderBy]: filters.order,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        taskTags: {
          include: {
            tag: true,
          },
        },
        taskFiles: true,
      },
    });

    const total = await db.tasks.count({ where });

    return {
      tasks: tasks,
      total: total,
    };
  },

  async getTaskById(taskId: number) {
    return await db.tasks.findUnique({
      where: { id: taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        taskTags: {
          include: {
            tag: true,
          },
        },
        taskFiles: true,
      },
    });
  },

  async updateTask(data: UpdateTaskInput) {
    const {
      taskId,
      userId,
      title,
      description,
      status,
      startedAt,
      dueDate,
      assigneeId,
      tags,
      attachments,
    } = data;

    return await db.tasks.update({
      where: { id: taskId },
      data: {
        userId: assigneeId ?? userId,
        title,
        description,
        startedAt,
        dueDate,
        status,
        taskTags: {
          deleteMany: {},
          create: (tags ?? []).map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { tag: tagName },
                create: { tag: tagName },
              },
            },
          })),
        },
        taskFiles: {
          deleteMany: {},
          create: (attachments ?? []).map((file) => ({
            fileName: file.name,
            fileUrl: file.url,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        taskTags: {
          include: {
            tag: true,
          },
        },
        taskFiles: true,
      },
    });
  },

  async deleteTask(taskId: number) {
    return await db.tasks.delete({
      where: { id: taskId },
    });
  },

  async createComment(taskId: number, userId: number, dto: CreateCommentRequest) {
    return await db.comments.create({
      data: {
        content: dto.content,
        taskId,
        authorId: userId,
      },
      include: {
        author: true,
      },
    });
  },

  async checkIfAcceptedMember(projectId: number, userId: number): Promise<boolean> {
    const invitation = await db.invitations.findFirst({
      where: {
        projectId,
        inviteeId: userId,
        status: 'accepted',
      },
    });

    return !!invitation;
  },

  async getCommentsByTask(taskId: number, skip: number, take: number) {
    const [comments, total] = await Promise.all([
      db.comments.findMany({
        where: { taskId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
        },
      }),
      db.comments.count({ where: { taskId } }),
    ]);

    return { comments, total };
  },
};
