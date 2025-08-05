import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 비밀번호 해시 생성
  const hashedPasswords = await Promise.all([
    bcrypt.hash('password1', 10),
    bcrypt.hash('password2', 10),
    bcrypt.hash('password3', 10),
    bcrypt.hash('password4', 10),
    bcrypt.hash('password5', 10),
    bcrypt.hash('password6', 10),
    bcrypt.hash('password7', 10),
    bcrypt.hash('password8', 10),
    bcrypt.hash('password9', 10),
    bcrypt.hash('password0', 10),
  ]);

  // 유저 생성
  const users = await Promise.all(
    hashedPasswords.map((hashedPwd, i) =>
      prisma.users.create({
        data: {
          email: `user${i + 1}@example.com`,
          password: hashedPwd,
          name: `User ${i + 1}`,
          profileImage: `https://example.com/img${i + 1}.png`,
          provider: 'local',
        },
      })
    )
  );

  // 기존 프로젝트 데이터 삭제
  await prisma.projects.deleteMany();

  // 프로젝트 생성
  const project1 = await prisma.projects.create({
    data: {
      name: 'Project Apollo',
      description: 'AI 연구 프로젝트',
      creatorId: users[0].id,
    },
  });
  const project2 = await prisma.projects.create({
    data: {
      name: 'Project Gemini',
      description: '웹 개발 프로젝트',
      creatorId: users[1].id,
    },
  });
  const project3 = await prisma.projects.create({
    data: {
      name: 'Project Mercury',
      description: '모바일 앱 프로젝트',
      creatorId: users[2].id,
    },
  });

  // 프로젝트 멤버 생성
  await prisma.project_members.createMany({
    data: [
      { projectId: project1.id, userId: users[0].id },
      { projectId: project1.id, userId: users[1].id },
      { projectId: project1.id, userId: users[2].id },
      { projectId: project1.id, userId: users[3].id },
      { projectId: project1.id, userId: users[4].id },
      { projectId: project2.id, userId: users[1].id },
      { projectId: project2.id, userId: users[5].id },
      { projectId: project2.id, userId: users[6].id },
      { projectId: project3.id, userId: users[2].id },
      { projectId: project3.id, userId: users[7].id },
      { projectId: project3.id, userId: users[8].id },
      { projectId: project3.id, userId: users[9].id },
    ],
  });

  // 초대장 생성
  await prisma.invitations.createMany({
    data: [
      {
        projectId: project1.id,
        invitorId: users[0].id,
        inviteeId: users[2].id,
        invitedAt: new Date(),
        acceptedAt: new Date(),
        status: 'accepted',
        token: 'token-1-3',
      },
      {
        projectId: project1.id,
        invitorId: users[0].id,
        inviteeId: users[3].id,
        invitedAt: new Date(),
        acceptedAt: new Date(),
        status: 'accepted',
        token: 'token-1-4',
      },
      {
        projectId: project1.id,
        invitorId: users[0].id,
        inviteeId: users[4].id,
        invitedAt: new Date(),
        acceptedAt: new Date(),
        status: 'accepted',
        token: 'token-1-5',
      },
      {
        projectId: project1.id,
        invitorId: users[0].id,
        inviteeId: users[5].id,
        invitedAt: new Date(),
        status: 'pending',
        token: 'token-1-6',
      },
      {
        projectId: project1.id,
        invitorId: users[0].id,
        inviteeId: users[6].id,
        status: 'pending',
        token: 'token-1-7',
      },
      {
        projectId: project2.id,
        invitorId: users[1].id,
        inviteeId: users[7].id,
        status: 'pending',
        token: 'token-2-8',
      },
      {
        projectId: project2.id,
        invitorId: users[1].id,
        inviteeId: users[8].id,
        status: 'pending',
        token: 'token-2-9',
      },
      {
        projectId: project3.id,
        invitorId: users[2].id,
        inviteeId: users[8].id,
        status: 'accepted',
        acceptedAt: new Date(),
        token: 'token-3-9',
      },
      {
        projectId: project3.id,
        invitorId: users[2].id,
        inviteeId: users[9].id,
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
