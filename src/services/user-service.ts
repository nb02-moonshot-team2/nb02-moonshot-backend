import bcrypt from 'bcrypt';
import UserRepository from '../repositories/user-repository';
import { errorMsg } from '../middlewares/error-handler';
import { Users, Projects } from '@prisma/client';

interface UpdateUserDto {
  email?: string;
  name?: string;
  profileImage?: string | null;
  currentPassword?: string;
  newPassword?: string;
}

interface ProjectListOptions {
  page: number;
  limit: number;
  order: 'asc' | 'desc';
  orderBy: 'createdAt' | 'name';
}

interface TaskFilterOptions {
  from?: string;
  to?: string;
  projectId?: number;
  status?: 'todo' | 'inProgress' | 'done';
  assignee?: number;
  keyword?: string;
}

class UserService {
  private userRepository = new UserRepository();

  async getMyInfo(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error(errorMsg.userNotFound);

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async updateMyInfo(userId: number, data: UpdateUserDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error(errorMsg.userNotFound);

    let hashedPassword: string | undefined;

    if (data.newPassword) {
      if (!data.currentPassword) throw new Error('현재 비밀번호가 필요합니다.');
      const isMatch = await bcrypt.compare(data.currentPassword, user.password);
      if (!isMatch) throw new Error('현재 비밀번호가 일치하지 않습니다.');

      hashedPassword = await bcrypt.hash(data.newPassword, 10);
    }

    const updateData: Partial<Users> = {};
    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage ?? '';
    if (hashedPassword) updateData.password = hashedPassword;

    const updatedUser = await this.userRepository.update(userId, updateData);
    const { password: _password, ...safeUser } = updatedUser;
    return safeUser;
  }

  async getMyProjects(
    userId: number,
    options: ProjectListOptions
  ): Promise<{
    data: (Projects & {
      memberCount: number;
      todoCount: number;
      inProgressCount: number;
      doneCount: number;
    })[];
    total: number;
  }> {
    const skip = (options.page - 1) * options.limit;

    const [total, projects] = await Promise.all([
      this.userRepository.countProjectsByUser(userId),
      this.userRepository.findProjectsByUser(userId, {
        skip,
        take: options.limit,
        orderBy: { [options.orderBy]: options.order },
      }),
    ]);

    return { data: projects, total };
  }

  async getMyTasks(userId: number, filter: TaskFilterOptions) {
    return this.userRepository.findTasksByUser(userId, filter);
  }
}

export default UserService;
