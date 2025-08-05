import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// import path
import subtaskPaths from '../swagger/paths/subtask-path.json';
import taskPaths from '../swagger/paths/task-path.json';
import memberPaths from '../swagger/paths/member-path.json';
import userPaths from '../swagger/paths/user-path.json';
import projectPaths from '../swagger/paths/project-path.json';
import authPaths from '../swagger/paths/auth-path.json';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moonshot',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'access-token': {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // auth req, res 형식
        authRegisterRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'testuser@example.com' },
            password: { type: 'string', example: 'testpassword' },
            name: { type: 'string', example: 'testuser' },
            profileImage: {
              type: ['string', 'null'],
              format: 'uri',
              nullable: true,
              example: 'https://example.com/files/image.png',
            },
          },
          required: ['email', 'password', 'name'],
        },
        authRegisterResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'testuser@example.com' },
            name: { type: 'string', example: 'testuser' },
            profileImage: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/files/image.png',
            },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-15T06:57:14.057Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-04-15T06:57:14.057Z' },
          },
        },
        loginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' },
          },
          required: ['email', 'password'],
        },
        loginOrRefreshResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1...' },
            refreshToken: { type: 'string', example: 'dGhpc0lzUmVmcmVzaFRva2Vu...' },
          },
          required: ['accessToken', 'refreshToken'],
        },

        // project req, res 형식
        projectCreateOrUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: '생성, 수정된 프로젝트 1 이름 ' },
            description: { type: 'string', example: '생성, 수정된 프로젝트 1 설명' },
          },
          required: ['name'],
        },
        projectResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '프로젝트 1' },
            description: { type: 'string', example: '프로젝트 1 설명' },
            memberCount: { type: 'integer', example: 1 },
            todoCount: { type: 'integer', example: 0 },
            inProgressCount: { type: 'integer', example: 0 },
            doneCount: { type: 'integer', example: 0 },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-04T10:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-04T10:00:00Z',
            },
          },
          required: ['id', 'name', 'description', 'createdAt', 'updatedAt']
        },

        // user req, res 형식

        userUpdateRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: '홍길동' },
            currentPassword: { type: 'string', example: 'currentPassword123' },
            newPassword: { type: 'string', example: 'newPassword456' },
            profileImage: {
              type: ['string', 'null'],
              example: 'https://example.com/files/profile.jpg',
              nullable: true,
            },
          },
          required: ['email', 'name', 'currentPassword'],
        },
        userResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'testuser@example.com' },
            name: { type: 'string', example: 'testuser' },
            profileImage: {
              type: 'string',
              example: 'https://example.com/files/image.png',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-04-15T06:57:14.057Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-04-15T06:57:14.057Z',
            },
          },
        },
        userProjectListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  name: { type: 'string', example: '프로젝트 1' },
                  description: { type: 'string', example: '프로젝트 1 설명' },
                  memberCount: { type: 'integer', example: 5 },
                  todoCount: { type: 'integer', example: 12 },
                  inProgressCount: { type: 'integer', example: 7 },
                  doneCount: { type: 'integer', example: 3 },
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-04-15T06:57:14.057Z',
                  },
                  updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-04-15T06:57:14.057Z',
                  },
                },
              },
            },
            total: { type: 'integer', example: 3 },
          },
          required: ['data', 'total'],
        },
        memberResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '홍길동' },
            email: { type: 'string', example: 'hong@example.com' },
            profileImage: {
              type: 'string',
              example: 'https://cdn.example.com/images/profile.png',
            },
            taskCount: { type: 'integer', example: 5 },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'rejected'],
              example: 'accepted',
            },
            invitationId: { type: 'integer', example: 101 },
          },
        },
        memberListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/memberResponse',
              },
            },
            total: {
              type: 'integer',
              example: 3,
            },
          },
        },
        commentCreateOrUpdateRequest: {
          type: 'object',
          properties: {
            content: { type: 'string', example: '생성된 댓글 또는 수정된 댓글' },
          },
          required: ['content'],
        },
        commentResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            content: { type: 'string', example: '댓글 내용입니다.' },
            taskId: { type: 'integer', example: 10 },
            author: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 5 },
                name: { type: 'string', example: '홍길동' },
                email: { type: 'string', example: 'hong@example.com' },
                profileImage: {
                  type: 'string',
                  example: 'https://cdn.example.com/profiles/hong.png',
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-01T09:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-01T12:00:00Z',
            },
          },
        },
        commentListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/commentResponse',
              },
            },
            total: {
              type: 'integer',
              example: 42,
            },
          },
        },
        taskCreateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: '새로운 작업 제목' },
            startYear: { type: 'integer', example: 2025 },
            startMonth: { type: 'integer', example: 8 },
            startDay: { type: 'integer', example: 1 },
            endYear: { type: 'integer', example: 2025 },
            endMonth: { type: 'integer', example: 8 },
            endDay: { type: 'integer', example: 15 },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
              example: 'todo',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
            },
            attachments: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          required: [
            'title',
            'startYear',
            'startMonth',
            'startDay',
            'endYear',
            'endMonth',
            'endDay',
            'status',
          ],
        },
        taskListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/taskResponse',
              },
            },
            total: { type: 'integer', example: 42 },
          },
        },
        taskResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            projectId: { type: 'integer', example: 10 },
            title: { type: 'string', example: '기획안 작성' },
            startYear: { type: 'integer', example: 2025 },
            startMonth: { type: 'integer', example: 8 },
            startDay: { type: 'integer', example: 1 },
            endYear: { type: 'integer', example: 2025 },
            endMonth: { type: 'integer', example: 8 },
            endDay: { type: 'integer', example: 15 },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
              example: 'in_progress',
            },
            assignee: {
              type: ['object', 'null'],
              nullable: true,
              properties: {
                id: { type: 'integer', example: 5 },
                name: { type: 'string', example: '홍길동' },
                email: { type: 'string', example: 'hong@example.com' },
                profileImage: {
                  type: 'string',
                  example: 'https://cdn.example.com/profiles/hong.png',
                },
              },
            },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  name: { type: 'string', example: '기획' },
                },
              },
            },
            attachments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 2 },
                  url: { type: 'string', example: 'https://cdn.example.com/files/doc.pdf' },
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time', example: '2025-08-01T09:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-08-01T12:00:00Z' },
          },
        },
        subtaskUpdateOrCreateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: '서브 작업 제목' },
          },
          required: ['title'],
        },
        subtaskResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: '하위 작업 제목' },
            taskId: { type: 'integer', example: 1 },
            status: { type: 'string', example: 'todo' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'access-token': [],
      },
    ],
    paths: {
      ...authPaths,
      ...userPaths,
      ...projectPaths,
      ...taskPaths,
      ...memberPaths,
      ...subtaskPaths,
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const useSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
