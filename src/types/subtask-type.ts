export type UpdateSubtask = {
  title: string;
};

export type CreateSubtask = {
  title: string;
};

export type SubTaskData = {
  id: number;
  taskId: number;
  description: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number | null;
};
