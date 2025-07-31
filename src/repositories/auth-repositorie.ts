import { PrismaClient, Users, Tokens } from '@prisma/client';

const prisma = new PrismaClient();

class AuthRepository {
  createUser = async (
    email: Users['email'],
    name: Users['name'],
    hashedPassword: Users['password'],
    profileImage: Users['profileImage'],
    provider: Users['provider']
  ) => {
    const user = await prisma.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
        profileImage,
        provider,
      },
    });
    return user;
  };

  getUserByEmail = async (email: Users['email']) => {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    return user;
  };

  getUserById = async (userId: Users['id']) => {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  };

  deleteRefreshToken = async (userId: Users['id']) => {
    await prisma.tokens.deleteMany({
      where: {
        userId,
      },
    });
  };

  saveRefreshToken = async (
    userId: Users['id'],
    refreshToken: Tokens['refreshToken'],
    expiresAt: Tokens['expiresAt']
  ) => {
    await prisma.tokens.create({
      data: {
        refreshToken,
        expiresAt,
        userId,
      },
    });
  };
}

export default AuthRepository;
