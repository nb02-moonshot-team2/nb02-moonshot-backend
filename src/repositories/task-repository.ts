import db from '../config/db';
import { Prisma } from '@prisma/client';
import { CreateTaskInput, GetAllTaskfilter } from '../utils/dtos/task-dto';

export const taskRepository = {
  async findProjectById(projectId: number) {
    return await db.projects.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
  },

  async isProjectMember(projectId: number, userId: number) {
    const member = await db.project_members.findFirst({
      where: { projectId, userId },
    });
    return Boolean(member);
  },


  async createTasks(data: CreateTaskInput) {
    return await db.tasks.create({
      data: {
        projectId: data.projectId,
        userId: data.userId,
        title: data.title,
        description: data.description,
        status: data.status,
        startedAt: data.startedAt,
        dueDate: data.dueDate,
        taskTags: {
          create: (data.tags ?? []).map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { tag: tagName },
                create: { tag: tagName },
              },
            },
          })),
        },
        taskFiles: {
          create: (data.attachments ?? []).map((file) => ({
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
      status: filters.status,
      userId: filters.assignee
    };

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
};
