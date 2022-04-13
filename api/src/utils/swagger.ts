import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const swaggerOptions: swaggerJsdoc.Options = {
  explorer: true,
  swaggerDefinition: {
    openapi: '3.0.1',
    servers: [
      {
        url: `/api/`,
      },
    ],
    info: {
      title: 'JobTech API',
      description: 'JobTech API Information',
      version,
      contact: {
        name: 'Damatag',
        email: 'info@damatag.com',
      },
    },
    tags: [
      // {
      //   name: 'Auth',
      //   description: 'Login, Register, and Me',
      // },
      // {
      //   name: 'Config',
      //   description: 'API config data',
      // },
    ],
    definitions: {
      Token: {
        type: 'object',
        properties: {
          tokenType: {
            type: 'string',
          },
          accessToken: {
            type: 'string',
          },
          refreshToken: {
            type: 'string',
          },
          expiresIn: {
            type: 'date',
          },
        },
      },
    },
    components: {
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
        ValidationError: {
          description: 'Validation error',
        },
        NotFoundError: {
          description: 'Not found error',
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'session',
        },
      },
    },
    security: ['cookieAuth'],
  },
  apis: ['./src/routes/**/*.ts', './src/models/**/*.ts', './src/schema/**/*.ts'],
};

export default swaggerOptions;
