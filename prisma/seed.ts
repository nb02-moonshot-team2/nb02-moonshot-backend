import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Users
  await prisma.users.createMany({
    data: [
      {
        id: 1,
        email: 'alice@example.com',
        name: 'Alice',
        password: 'hashed_pw_1',
        profileImage: 'https://example.com/images/alice.png',
        provider: 'local',
      },
      {
        id: 2,
        email: 'bob@example.com',
        name: 'Bob',
        password: 'hashed_pw_2',
        profileImage: 'https://example.com/images/bob.png',
        provider: 'local',
      },
      {
        id: 3,
        email: 'carol@example.com',
        name: 'Carol',
        password: 'hashed_pw_3',
        profileImage: 'https://example.com/images/carol.png',
        provider: 'local',
      },
      {
        id: 4,
        email: 'dave@example.com',
        name: 'Dave',
        password: 'hashed_pw_4',
        profileImage: 'https://example.com/images/dave.png',
        provider: 'local',
      },
      {
        id: 5,
        email: 'eve@example.com',
        name: 'Eve',
        password: 'hashed_pw_5',
        profileImage: 'https://example.com/images/eve.png',
        provider: 'local',
      },
    ],
    skipDuplicates: true,
  });

  // 2. Tokens (로그인 상태 시뮬레이션)
  await prisma.tokens.createMany({
    data: [
      {
        userId: 1,
        refreshToken: 'mock-refresh-token-1',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // +7일
      },
      {
        userId: 2,
        refreshToken: 'mock-refresh-token-2',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      {
        userId: 3,
        refreshToken: 'mock-refresh-token-3',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      {
        userId: 4,
        refreshToken: 'mock-refresh-token-4',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      {
        userId: 5,
        refreshToken: 'mock-refresh-token-5',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    ],
  });

  // 3. Projects
  await prisma.projects.createMany({
    data: [
      {
        id: 1,
        name: 'Alpha',
        description: 'Project Alpha description',
        creatorId: 1,
      },
      {
        id: 2,
        name: 'Beta',
        description: 'Project Beta description',
        creatorId: 1,
      },
      {
        id: 3,
        name: 'Gamma',
        description: 'Project Gamma description',
        creatorId: 2,
      },
      {
        id: 4,
        name: 'Delta',
        description: 'Project Delta description',
        creatorId: 2,
      },
    ],
    skipDuplicates: true,
  });

  // 4. Project_members
  await prisma.project_members.createMany({
    data: [
      { projectId: 1, userId: 1 },
      { projectId: 1, userId: 2 },
      { projectId: 2, userId: 1 },
      { projectId: 2, userId: 3 },
      { projectId: 3, userId: 2 },
      { projectId: 3, userId: 4 },
      { projectId: 4, userId: 2 },
      { projectId: 4, userId: 5 },
    ],
    skipDuplicates: true,
  });

  // 5. Invitations
  await prisma.invitations.createMany({
    data: [
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 3,
        status: 'pending',
        token: 'token123',
      },
      {
        projectId: 2,
        invitorId: 1,
        inviteeId: 4,
        status: 'accepted',
        acceptedAt: new Date(),
        token: 'token456',
      },
      {
        projectId: 3,
        invitorId: 2,
        inviteeId: 5,
        status: 'rejected',
        token: 'token789',
      },
    ],
  });
}

main()
  .then(() => {
    console.log('✅ Seed data inserted successfully!');
  })
  .catch((e) => {
    console.error('❌ Seed failed:', e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
