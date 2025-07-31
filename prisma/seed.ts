import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ✅ 1. Users 테이블에 사용자 데이터 먼저 삽입
  await prisma.users.createMany({
    data: [
      {
        id: 1,
        email: 'user1@example.com',
        name: 'User One',
        password: 'hashed1',
        profileImage: '',
        provider: 'local',
      },
      {
        id: 2,
        email: 'user2@example.com',
        name: 'User Two',
        password: 'hashed2',
        profileImage: '',
        provider: 'local',
      },
      {
        id: 3,
        email: 'user3@example.com',
        name: 'User Three',
        password: 'hashed3',
        profileImage: '',
        provider: 'local',
      },
      {
        id: 4,
        email: 'user4@example.com',
        name: 'User Four',
        password: 'hashed4',
        profileImage: '',
        provider: 'local',
      },
      {
        id: 5,
        email: 'user5@example.com',
        name: 'User Five',
        password: 'hashed5',
        profileImage: '',
        provider: 'local',
      },
      {
        id: 6,
        email: 'user6@example.com',
        name: 'User Six',
        password: 'hashed6',
        profileImage: '',
        provider: 'local',
      },
      {
        id: 7,
        email: 'user7@example.com',
        name: 'User Seven',
        password: 'hashed7',
        profileImage: '',
        provider: 'local',
      },
      {
        id: 8,
        email: 'user8@example.com',
        name: 'User Eight',
        password: 'hashed8',
        profileImage: '',
        provider: 'local',
      },
      {
        id: 9,
        email: 'user9@example.com',
        name: 'User Nine',
        password: 'hashed9',
        profileImage: '',
        provider: 'local',
      },
      {
        id: 10,
        email: 'user10@example.com',
        name: 'User Ten',
        password: 'hashed10',
        profileImage: '',
        provider: 'local',
      },
    ],
  });

  // ✅ 2. Projects 테이블에 프로젝트 데이터 삽입 (Users의 id를 참조)
  await prisma.projects.createMany({
    data: [
      { id: 1, name: 'Project Apollo', description: 'AI 연구 프로젝트', creatorId: 1 },
      { id: 2, name: 'Project Gemini', description: '웹 개발 프로젝트', creatorId: 2 },
      { id: 3, name: 'Project Mercury', description: '모바일 앱 프로젝트', creatorId: 3 },
    ],
  });

  // ✅ 3. Project_members 테이블에 프로젝트 참여자 데이터 삽입
  await prisma.project_members.createMany({
    data: [
      { id: 1, projectId: 1, userId: 1 },
      { id: 2, projectId: 1, userId: 4 },
      { id: 3, projectId: 1, userId: 5 },
      { id: 4, projectId: 1, userId: 6 },
      { id: 5, projectId: 2, userId: 2 },
      { id: 6, projectId: 2, userId: 7 },
      { id: 7, projectId: 2, userId: 8 },
      { id: 8, projectId: 3, userId: 3 },
      { id: 9, projectId: 3, userId: 9 },
    ],
  });

  // ✅ 4. Invitations 테이블에 초대 데이터 삽입
  await prisma.invitations.createMany({
    data: [
      {
        id: 1,
        projectId: 1,
        invitorId: 1,
        inviteeId: 4,
        status: 'accepted',
        acceptedAt: new Date(),
        token: 'token-1-4',
      },
      {
        id: 2,
        projectId: 1,
        invitorId: 1,
        inviteeId: 5,
        status: 'accepted',
        acceptedAt: new Date(),
        token: 'token-1-5',
      },
      {
        id: 3,
        projectId: 1,
        invitorId: 1,
        inviteeId: 6,
        status: 'accepted',
        acceptedAt: new Date(),
        token: 'token-1-6',
      },
      { id: 4, projectId: 1, invitorId: 1, inviteeId: 7, status: 'pending', token: 'token-1-7' },
      {
        id: 5,
        projectId: 2,
        invitorId: 2,
        inviteeId: 7,
        status: 'accepted',
        acceptedAt: new Date(),
        token: 'token-2-7',
      },
      {
        id: 6,
        projectId: 2,
        invitorId: 2,
        inviteeId: 8,
        status: 'accepted',
        acceptedAt: new Date(),
        token: 'token-2-8',
      },
      { id: 7, projectId: 2, invitorId: 2, inviteeId: 9, status: 'pending', token: 'token-2-9' },
      {
        id: 8,
        projectId: 3,
        invitorId: 3,
        inviteeId: 9,
        status: 'accepted',
        acceptedAt: new Date(),
        token: 'token-3-9',
      },
      { id: 9, projectId: 3, invitorId: 3, inviteeId: 10, status: 'pending', token: 'token-3-10' },
    ],
  });
}

// 시드 데이터 실행
main()
  .then(() => console.log('🌱 시드 데이터가 성공적으로 삽입되었습니다!'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
