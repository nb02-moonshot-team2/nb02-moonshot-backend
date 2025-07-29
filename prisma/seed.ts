import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Projects
  await prisma.projects.createMany({
    data: [
      { id: 1, name: 'Project Apollo', description: 'AI 연구 프로젝트', creatorId: 1 },
      { id: 2, name: 'Project Gemini', description: '웹 개발 프로젝트', creatorId: 2 },
      { id: 3, name: 'Project Mercury', description: '모바일 앱 프로젝트', creatorId: 3 },
    ],
  });

  // 2. Project_members (creator 포함 + 초대 수락한 유저만)
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

  // 3. Invitations (accepted/pending 포함, token 추가됨)
  await prisma.invitations.createMany({
    data: [
      // Project 1
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
      {
        id: 4,
        projectId: 1,
        invitorId: 1,
        inviteeId: 7,
        status: 'pending',
        token: 'token-1-7',
      },

      // Project 2
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
      {
        id: 7,
        projectId: 2,
        invitorId: 2,
        inviteeId: 9,
        status: 'pending',
        token: 'token-2-9',
      },

      // Project 3
      {
        id: 8,
        projectId: 3,
        invitorId: 3,
        inviteeId: 9,
        status: 'accepted',
        acceptedAt: new Date(),
        token: 'token-3-9',
      },
      {
        id: 9,
        projectId: 3,
        invitorId: 3,
        inviteeId: 10,
        status: 'pending',
        token: 'token-3-10',
      },
    ],
  });
}

main()
  .then(() => console.log('🌱 Seed data inserted successfully!'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
