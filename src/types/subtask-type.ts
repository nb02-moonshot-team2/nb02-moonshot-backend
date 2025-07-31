export type UpdatedSubtask = {
  title: string;
};

export type CreatedSubtask = {
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
