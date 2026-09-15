import pino from 'pino';
import { env } from './helpers.js';

const isDev = env('APP_ENV', 'development') === 'development';

const logger = pino(
  {
    level: env('LOG_LEVEL', 'info'),
  },
  isDev ? pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  }) : undefined
);

export default logger;
