import * as projectRepository from '../repositories/project-repository';
import { statusCode, errorMsg } from '../middlewares/error-handler';

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

interface DeleteProjectParams {
  creatorId: number;
  projectId: number;
}

// 서비스 함수 반환 타입
interface SuccessResult<T> {
  data: T;
}

interface ErrorResult {
  error: true;
  message: string;
  status: number;
}

type ServiceResult<T> = SuccessResult<T> | ErrorResult;

export const createProjectService = async (
  params: CreateProjectParams
): Promise<
  ServiceResult<{
    id: number;
    name: string;
    description: string;
    memberCount: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
  }>
> => {
  const newProject = await projectRepository.createProject(params);

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

export const getProjectService = async (
  projectId: number
): Promise<
  ServiceResult<{
    id: number;
    name: string;
    description: string;
    memberCount: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
  }>
> => {
  const project = await projectRepository.getProject(projectId);

  if (!project) {
    return {
      error: true,
      status: statusCode.badRequest,
      message: errorMsg.projectNotFound,
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

export const updateProjectService = async (
  params: UpdateProjectParams
): Promise<
  ServiceResult<{
    id: number;
    name: string;
    description: string;
    memberCount: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
  }>
> => {
  const { creatorId, projectId, name, description } = params;

  const project = await projectRepository.getProject(projectId);

  if (!project) {
    return {
      error: true,
      status: statusCode.badRequest,
      message: errorMsg.projectNotFound,
    };
  }

  if (project.data.creatorId !== creatorId) {
    return {
      error: true,
      status: statusCode.forbidden,
      message: errorMsg.noPermissionToUpdate,
    };
  }

  if (!name && !description) {
    return {
      error: true,
      status: statusCode.badRequest,
      message: errorMsg.badRequest,
    };
  }

  const updatedProject = await projectRepository.updateProject({ projectId, name, description });

  return {
    data: {
      id: updatedProject.id,
      name: updatedProject.name,
      description: updatedProject.description,
      memberCount: project.data.memberCount,
      todoCount: project.data.todoCount,
      inProgressCount: project.data.inProgressCount,
      doneCount: project.data.doneCount,
    },
  };
};

export const deleteProjectService = async (
  params: DeleteProjectParams
): Promise<ServiceResult<{ message: string }>> => {
  const { creatorId, projectId } = params;

  const project = await projectRepository.getProject(projectId);

  if (!project) {
    return {
      error: true,
      status: statusCode.badRequest,
      message: errorMsg.projectNotFound,
    };
  }

  if (project.data.creatorId !== creatorId) {
    return {
      error: true,
      status: statusCode.forbidden,
      message: errorMsg.noPermissionToUpdate,
    };
  }

  await projectRepository.deleteProject(projectId);

  return {
    data: { message: '프로젝트가 성공적으로 삭제되었습니다.' },
  };
};
