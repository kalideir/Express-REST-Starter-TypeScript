import pino from 'pino';
import dayjs from 'dayjs';

const transport = pino.transport({
  target: 'pino-pretty',
  options: { colorize: true },
});

const logger = pino(
  {
    level: 'debug',
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
  },
  transport,
);

export default logger;
