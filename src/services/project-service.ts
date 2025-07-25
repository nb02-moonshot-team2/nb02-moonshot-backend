import * as projectRepo from '../repositories/project-repository';
import { statusCode, errorMsg } from '../utils/error';

interface ICreateProjectParams {
  creatorId: number;
  name: string;
  description: string;
}

export const createProjectService = async (params: ICreateProjectParams) => {
  const { creatorId } = params;

  const userProjects = await projectRepo.findProjectsByCreatorId(creatorId);

  if (userProjects.length >= 5) {
    return { error: true, message: errorMsg.maxProjectLimit, status: statusCode.badRequest };
  }

  const newProject = await projectRepo.createProject(params);
  return { error: false, data: newProject };
};

export const getProjectService = async (projectId: number) => {
  const project = await projectRepo.getProject(projectId);

  if (!project) {
    return { error: true, message: errorMsg.projectNotFound, status: statusCode.notFound };
  }

  return { error: false, data: project };
};
