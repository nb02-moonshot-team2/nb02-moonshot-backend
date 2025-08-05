import prisma from '../config/db';
import { task_status } from '@prisma/client';

interface CreateProjectParams {
  creatorId: number;
  name: string;
  description: string;
}

interface UpdateProjectParams {
  projectId: number;
  name?: string;
  description?: string;
}

interface GetProjectWithCounts {
  data: {
    id: number;
    name: string;
    description: string;
    memberCount: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
    creatorId: number;
  };
}

export const createProjectWithMember = async ({
  creatorId,
  name,
  description,
}: CreateProjectParams) => {
  return await prisma.$transaction(async (tx) => {
    const newProject = await tx.projects.create({
      data: {
        creatorId,
        name,
        description,
      },
    });

    await tx.project_members.create({
      data: {
        projectId: newProject.id,
        userId: creatorId,
      },
    });

    return newProject;
  });
};

export const getProject = async (projectId: number): Promise<GetProjectWithCounts | null> => {
  const project = await prisma.projects.findUnique({
    where: { id: projectId },
  });

  if (!project) return null;

  const memberCount = await prisma.project_members.count({
    where: { projectId },
  });

  const todoCount = await prisma.tasks.count({
    where: { projectId, status: task_status.todo },
  });

  const inProgressCount = await prisma.tasks.count({
    where: { projectId, status: task_status.inProgress },
  });

  const doneCount = await prisma.tasks.count({
    where: { projectId, status: task_status.done },
  });

  return {
    data: {
      id: project.id,
      name: project.name,
      description: project.description,
      memberCount,
      todoCount,
      inProgressCount,
      doneCount,
      creatorId: project.creatorId,
    },
  };
};

export const updateProject = async ({ projectId, name, description }: UpdateProjectParams) => {
  return prisma.projects.update({
    where: { id: projectId },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
    },
  });
};

export const deleteProject = async (projectId: number) => {
  return prisma.projects.delete({
    where: { id: projectId },
  });
};

export const getProjectMembersEmails = async (projectId: number): Promise<string[]> => {
  const members = await prisma.project_members.findMany({
    where: { projectId },
    select: {
      user: {
        select: { email: true },
      },
    },
  });

  return members.map((m) => m.user.email);
};
