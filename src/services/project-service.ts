import * as projectRepo from '../repositories/project-repository';
import { statusCode, errorMsg } from '../utils/error';

interface CreateProjectParams {
  creatorId: number;
  name: string;
  description: string;
}

interface UpdateProjectParams {
  creatorId: number;
  projectId: number;
  name?: string;
  description?: string;
}

export const createProjectService = async (params: CreateProjectParams) => {
  const { creatorId } = params;

  const userProjects = await projectRepo.findProjectsByCreatorId(creatorId);

  if (userProjects.length >= 5) {
    return {
      error: true,
      status: statusCode.badRequest,
      message: errorMsg.maxProjectLimit,
    };
  }

  const newProject = await projectRepo.createProject(params);

  return {
    data: {
      id: newProject.id,
      name: newProject.name,
      description: newProject.description,
      memberCount: 0,
      todoCount: 0,
      inProgressCount: 0,
      doneCount: 0,
    },
  };
};

export const getProjectService = async (projectId: number) => {
  const project = await projectRepo.getProject(projectId);

  if (!project) {
    return {
      error: true,
      status: statusCode.badRequest,
      message: errorMsg.badRequest,
    };
  }

  const { id, name, description, memberCount, todoCount, inProgressCount, doneCount } =
    project.data;

  return {
    data: {
      id,
      name,
      description,
      memberCount,
      todoCount,
      inProgressCount,
      doneCount,
    },
  };
};

export const updateProjectService = async (params: UpdateProjectParams) => {
  const { creatorId, projectId, name, description } = params;

  const project = await projectRepo.getProject(projectId);

  if (!project) {
    return {
      error: true,
      status: statusCode.badRequest,
      message: errorMsg.badRequest,
    };
  }

  if (project.data.creatorId !== creatorId) {
    return {
      error: true,
      status: statusCode.forbidden,
      message: errorMsg.forbiddenAdmin,
    };
  }

  if (!name && !description) {
    return {
      error: true,
      status: statusCode.badRequest,
      message: errorMsg.badRequest,
    };
  }

  const updated = await projectRepo.updateProject({ projectId, name, description });

  return {
    data: {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      memberCount: project.data.memberCount,
      todoCount: project.data.todoCount,
      inProgressCount: project.data.inProgressCount,
      doneCount: project.data.doneCount,
    },
  };
};
