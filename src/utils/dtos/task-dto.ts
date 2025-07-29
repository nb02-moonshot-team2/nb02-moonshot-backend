import { task_status } from '@prisma/client';
import { Tags, TaskAttachment, TaskAttachmentInput, TaskOrder, TaskOrderBy, Assignee } from '../../types/task-type';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: task_status;
  tags?: string[];
  attachments?: string[];
}

export interface CreateTaskInput {
  projectId: number;
  userId: number;
  title: string;
  description?: string;
  status: task_status;
  startedAt: Date;
  dueDate: Date;
  tags?: string[];
  attachments?: TaskAttachmentInput[];
}

export interface CreateTaskResponse {
  id: number;
  projectId: number;
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: task_status;
  tags: Tags[];
  attachments: TaskAttachment[];
  assignee: Assignee;
  createdAt: Date;
  updatedAt: Date;
}


export interface GetAllTaskQuery {
  projectId: number;
  userId: number;
  page: number;
  limit: number;
  status: task_status;
  assignee: number;
  keyword?: string;
  order: TaskOrder;
  orderBy: TaskOrderBy;
}

export interface GetAllTaskfilter {
  projectId: number;
  userId: number;
  status: task_status;
  assignee: number;
  keyword?: string;
  order: TaskOrder;
  orderBy: TaskOrderBy;
  skip: number;
  take: number;
}

export interface GetAllTasksResponse {
  id: number;
  projectId: number;
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: task_status;
  tags: Tags[];
  attachments: TaskAttachment[];
  assignee: Assignee;
  createdAt: Date;
  updatedAt: Date;
}