import { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { logger } from '../utils';
import { Router } from 'express';
import config from 'config';

import swaggerOptions from '../utils/swagger';

const router = Router();

const baseUrl = config.get('baseUrl');

const swaggerSpec = swaggerJsdoc(swaggerOptions);

router.get('/docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

router.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

logger.info(`Swagger docs available at ${baseUrl}/api/docs`);

export default router;
