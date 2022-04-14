import express from 'express';
import compress from 'compression';
import morgan from 'morgan';
import routes from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import i18n from 'i18next';
import i18nBackend from 'i18next-fs-backend';
import i18nMiddleware from 'i18next-http-middleware';
import { error } from './middleware';
import initializedPassport from './auth';
import { stream } from './utils';
import config from 'config';
// import listRoutes from 'express-list-routes';

i18n
  .use(i18nBackend)
  .use(i18nMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
  });

const app = express();

app.use(morgan('dev', { stream })); // @todo LOG_FORMAT add to env and config defalt

app.use(cookieParser());

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

app.use(i18nMiddleware.handle(i18n));

app.use(
  cookieSession({
    name: config.get<string>('cookieName'),
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.get<string>('cookieKey1')],
  }),
);

initializedPassport(app);

app.use('/api/', routes);

app.use(error);

// listRoutes(routes, { prefix: '/api/' });

export default app;
