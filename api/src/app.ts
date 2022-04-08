/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import express from 'express';
import config from 'config';
import compress from 'compression';
import { dbConnect } from './utils';
import { logger } from './utils';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';
import cors from 'cors';
import helmet from 'helmet';
import expressListRoutes from 'express-list-routes';

const baseUrl = config.get<string>('baseUrl');

const app = express();

app.use(express.json());

app.use(compress());

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors());

app.use(helmet());

app.use(
  cors({
    origin: ['*'],
    optionsSuccessStatus: 200,
  }),
);

app.use(deserializeUser);

app.use('/api/', routes);

const port = config.get('port');
const PORT = process.env.PORT || port;

app.listen(PORT, async () => {
  logger.info(`App started at ${baseUrl}`);

  await dbConnect();
  // expressListRoutes(routes, { prefix: '/api/' });
});
