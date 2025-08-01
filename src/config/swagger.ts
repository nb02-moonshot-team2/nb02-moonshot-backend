import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

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
        subtaskUpdateOrCreateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: '변경된 제목' },
          },
          required: ['title'],
        },
        subtaskResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: '하위 할 일 제목' },
            taskId: { type: 'integer', example: 1 },
            status: { type: 'string', example: 'todo' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-01T12:34:56Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-02T08:00:00Z',
            },
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
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

// ✅ Swagger 문서 등록
export const useSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
