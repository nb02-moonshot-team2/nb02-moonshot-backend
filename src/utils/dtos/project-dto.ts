export interface CreateProjectDTO {
  creatorId: number;
  name: string;
  description: string;
}

export interface UpdateProjectDTO {
  creatorId: number;
  projectId: number;
  name?: string;
  description?: string;
}

export interface DeleteProjectDTO {
  creatorId: number;
  projectId: number;
}
