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
import i18n from 'i18next';
import i18nBackend from 'i18next-fs-backend';
import i18nMiddleware from 'i18next-http-middleware';

i18n
  .use(i18nBackend)
  .use(i18nMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
  });

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

app.use(i18nMiddleware.handle(i18n));

app.use('/api/', routes);

const port = config.get('port');
const PORT = process.env.PORT || port;

app.listen(PORT, async () => {
  await dbConnect();

  logger.info(`App started at ${baseUrl}`);
  // expressListRoutes(routes, { prefix: '/api/' });
});
