export interface CreateCommentRequest {
  content: string;
}

export interface CommentAuthor {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;
}

export interface CreateCommentResponse {
  id: number;
  content: string;
  taskId: number;
  author: CommentAuthor;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetCommentsResponse {
  data: CreateCommentResponse[];
  total: number;
}
