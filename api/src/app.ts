import express from 'express';
import compress from 'compression';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser.middleware';
import cors from 'cors';
import helmet from 'helmet';
import i18n from 'i18next';
import i18nBackend from 'i18next-fs-backend';
import i18nMiddleware from 'i18next-http-middleware';
import { error } from './middleware';
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

app.use(error);

// listRoutes(routes, { prefix: '/api/' });

export default app;
