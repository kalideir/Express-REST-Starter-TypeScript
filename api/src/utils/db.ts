import mongoose, { set } from 'mongoose';
import config from 'config';
import logger from './logger';

function connect() {
  const dbURI = config.get('dbURI') as string;

  if (this.env !== 'production') {
    set('debug', true);
  }

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
