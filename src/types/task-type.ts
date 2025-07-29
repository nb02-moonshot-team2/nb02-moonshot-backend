export interface Tags {
  id: number;
  name: string;
}

export interface TaskAttachment {
  id: number;
  url: string;
}

export interface TaskAttachmentInput {
  name: string;
  url: string;
}

export interface Assignee {
  id: number;
  name: string;
  email: string;
  profileImage: string;
}

export enum TaskOrder {
  asc = 'asc',
  desc = 'desc',
}

export enum TaskOrderBy {
  createdAt = 'created_at',
  name = 'name',
  endDate = 'end_date',
}

