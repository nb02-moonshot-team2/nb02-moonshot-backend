import * as projectRepository from '../repositories/project-repository';
import { statusCode, errorMsg } from '../middlewares/error-handler';
import { CreateProjectDTO, UpdateProjectDTO, DeleteProjectDTO } from '../utils/dtos/project-dto';

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

type ProjectSummary = {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
};

export const createProjectService = async (
  params: CreateProjectDTO
): Promise<ServiceResult<ProjectSummary>> => {
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
): Promise<ServiceResult<ProjectSummary>> => {
  const project = await projectRepository.getProject(projectId);

  if (!project) {
    return {
      error: true,
      status: statusCode.badRequest,
      message: errorMsg.projectNotFound,
    };
  }

  return {
    data: project.data,
  };
};

export const updateProjectService = async (
  params: UpdateProjectDTO
): Promise<ServiceResult<ProjectSummary>> => {
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
  params: DeleteProjectDTO
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
