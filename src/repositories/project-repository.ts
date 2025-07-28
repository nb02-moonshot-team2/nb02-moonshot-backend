import prisma from '../lib/client';
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

// 프로젝트 목록 조회 (생성자 기준)
export const findProjectsByCreatorId = async (creatorId: number) => {
  return prisma.projects.findMany({
    where: { creatorId },
  });
};

// 프로젝트 생성
export const createProject = async (params: CreateProjectParams) => {
  return prisma.projects.create({
    data: params,
  });
};

// 프로젝트 조회
export const getProject = async (projectId: number) => {
  const project = await prisma.projects.findUnique({
    where: { id: projectId },
  });

  if (!project) return null;

  let memberCount = 0;
  let todoCount = 0;
  let inProgressCount = 0;
  let doneCount = 0;

  // project_members 테이블이 없어도 에러 무시
  try {
    memberCount = await prisma.project_members.count({ where: { projectId } });
  } catch {
    // ignore if table doesn't exist
  }

  // tasks 테이블이 없어도 에러 무시
  try {
    todoCount = await prisma.tasks.count({
      where: { projectId, status: task_status.todo },
    });

    inProgressCount = await prisma.tasks.count({
      where: { projectId, status: task_status.in_progress },
    });

    doneCount = await prisma.tasks.count({
      where: { projectId, status: task_status.done },
    });
  } catch {
    // ignore if table doesn't exist
  }

  return {
    data: {
      id: project.id,
      name: project.name,
      description: project.description,
      memberCount,
      todoCount,
      inProgressCount,
      doneCount,
      creatorId: project.creatorId, // 내부 용도
    },
  };
};

// 프로젝트 수정
export const updateProject = (params: UpdateProjectParams) => {
  const { projectId, name, description } = params;

  return prisma.projects.update({
    where: { id: projectId },
    data: { name, description },
  });
};
