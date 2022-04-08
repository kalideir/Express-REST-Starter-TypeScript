import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

function connect() {
  const dbURI = config.get('dbURI') as string;

  return mongoose
    .connect(dbURI)
    .then(() => {
      logger.info('Database connected');
    })
    .catch(error => {
      logger.error(error);
      process.exit(1);
    });
}

export default connect;
