import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. 프로젝트 생성
  await prisma.projects.create({
    data: {
      name: '댓글 테스트용 프로젝트',
      description: '댓글 API 테스트를 위한 기본 프로젝트입니다.',
      creatorId: 1, // 이미 회원가입한 유저 ID
    },
  });

  // 2. 태스크 생성
  await prisma.tasks.create({
    data: {
      projectId: 1, // 위에서 생성한 프로젝트 ID
      title: '댓글 테스트용 태스크',
      description: '댓글 생성을 테스트하는 데 사용할 작업입니다.',
      status: 'todo',
      userId: 1, // 이미 가입된 유저 ID
      startedAt: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  });

  // 3. 프로젝트 멤버 등록 (생성자 + 수락한 유저들)
  await prisma.project_members.createMany({
    data: [
      { projectId: 1, userId: 1 }, // creator
      { projectId: 1, userId: 2 },
      { projectId: 1, userId: 3 },
      { projectId: 1, userId: 4 },
      { projectId: 1, userId: 5 },
    ],
  });

  // 4. 초대 기록 (userId 2~10)
  await prisma.invitations.createMany({
    data: [
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 2,
        invitedAt: new Date(),
        acceptedAt: new Date(),
        status: 'accepted',
        token: 'token-1-2',
      },
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 3,
        invitedAt: new Date(),
        acceptedAt: new Date(),
        status: 'accepted',
        token: 'token-1-3',
      },
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 4,
        invitedAt: new Date(),
        acceptedAt: new Date(),
        status: 'accepted',
        token: 'token-1-4',
      },
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 5,
        invitedAt: new Date(),
        acceptedAt: new Date(),
        status: 'accepted',
        token: 'token-1-5',
      },
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 6,
        invitedAt: new Date(),
        status: 'pending',
        token: 'token-1-6',
      },
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 7,
        invitedAt: new Date(),
        status: 'pending',
        token: 'token-1-7',
      },
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 8,
        invitedAt: new Date(),
        status: 'pending',
        token: 'token-1-8',
      },
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 9,
        invitedAt: new Date(),
        status: 'pending',
        token: 'token-1-9',
      },
      {
        projectId: 1,
        invitorId: 1,
        inviteeId: 10,
        invitedAt: new Date(),
        status: 'pending',
        token: 'token-1-10',
      },
    ],
  });
}

main()
  .then(() => console.log('🧪 댓글 테스트용 프로젝트 & 태스크 생성 완료!'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
