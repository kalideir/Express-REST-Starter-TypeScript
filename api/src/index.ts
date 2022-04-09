require('dotenv').config();
import config from 'config';
import app from './app';
import { dbConnect, logger } from './utils';

const PORT = config.get<number>('port');

app.listen(PORT, async () => {
  await dbConnect();

  logger.info(`App started at http://localhost:${PORT}`);
});
