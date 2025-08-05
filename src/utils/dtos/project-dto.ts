// 프로젝트 생성 시 필요한 데이터
export interface CreateProjectDTO {
  creatorId: number;
  name: string;
  description: string;
}

// 프로젝트 수정 시 필요한 데이터
export interface UpdateProjectDTO {
  creatorId: number;
  projectId: number;
  name?: string;
  description?: string;
}

// 프로젝트 삭제 시 필요한 데이터
export interface DeleteProjectDTO {
  creatorId: number;
  projectId: number;
}
