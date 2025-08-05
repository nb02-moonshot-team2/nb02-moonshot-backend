import prisma from '../config/db';
import { Users, Projects, Tasks, Prisma } from '@prisma/client';

class UserRepository {
  async findById(userId: number): Promise<Users | null> {
    return prisma.users.findUnique({ where: { id: userId } });
  }

  async update(userId: number, data: Partial<Users>): Promise<Users> {
    return prisma.users.update({
      where: { id: userId },
      data,
    });
  }

  async countProjectsByUser(userId: number): Promise<number> {
    return prisma.project_members.count({
      where: { userId },
    });
  }

  async findProjectsByUser(
    userId: number,
    options: {
      skip: number;
      take: number;
      orderBy: Prisma.ProjectsOrderByWithRelationInput;
    }
  ): Promise<
    (Projects & {
      memberCount: number;
      todoCount: number;
      inProgressCount: number;
      doneCount: number;
    })[]
  > {
    const projects = await prisma.projects.findMany({
      where: {
        projectMembers: {
          some: {
            userId,
          },
        },
      },
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
      include: {
        projectMembers: true,
        tasks: true,
      },
    });

    return projects.map((project) => {
      const memberCount = project.projectMembers.length;
      const todoCount = project.tasks.filter((t) => t.status === 'todo').length;
      const inProgressCount = project.tasks.filter((t) => t.status === 'inProgress').length;
      const doneCount = project.tasks.filter((t) => t.status === 'done').length;

      return {
        ...project,
        memberCount,
        todoCount,
        inProgressCount,
        doneCount,
      };
    });
  }

  async findTasksByUser(
    userId: number,
    filter: {
      from?: string;
      to?: string;
      projectId?: number;
      status?: 'todo' | 'inProgress' | 'done';
      assignee?: number;
      keyword?: string;
    }
  ): Promise<
    (Tasks & {
      user: Pick<Users, 'id' | 'name' | 'email' | 'profileImage'> | null;
      taskTags: {
        tag: { id: number; tag: string };
      }[];
      taskFiles: { id: number; fileUrl: string }[];
    })[]
  > {
    const where: Prisma.TasksWhereInput = {
      ...(filter.assignee ? { userId: filter.assignee } : { userId }),
      projectId: filter.projectId,
      status: filter.status,
      ...(filter.keyword
        ? {
            title: {
              contains: filter.keyword,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(filter.from || filter.to
        ? {
            createdAt: {
              ...(filter.from ? { gte: new Date(filter.from) } : {}),
              ...(filter.to ? { lte: new Date(filter.to) } : {}),
            },
          }
        : {}),
    };

    return prisma.tasks.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, profileImage: true },
        },
        taskTags: {
          include: {
            tag: true,
          },
        },
        taskFiles: true,
      },
    });
  }
}

export default UserRepository;
