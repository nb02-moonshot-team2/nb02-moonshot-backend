import prisma from '../lib/client';

interface ICreateProjectParams {
  creatorId: number;
  name: string;
  description: string;
}

export const findProjectsByCreatorId = async (creatorId: number) => {
  return await prisma.projects.findMany({
    where: { creatorId },
  });
};

export const createProject = async (params: ICreateProjectParams) => {
  return await prisma.projects.create({
    data: params,
  });
};

export const getProject = async (projectId: number) => {
  return await prisma.projects.findUnique({
    where: { id: projectId },
  });
};
