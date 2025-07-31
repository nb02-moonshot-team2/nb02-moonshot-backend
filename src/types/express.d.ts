declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      nickname: string;
      password: string;
      profileImage: string | null;
      refreshToken: string | null;
      createdAt: Date;
      updatedAt: Date;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
