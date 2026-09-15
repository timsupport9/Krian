import { env, envInt } from '../core/helpers.js';

export default {
  driver: 'mysql',
  host: env('DB_HOST', 'localhost'),
  port: envInt('DB_PORT', 3306),
  database: env('DB_NAME', 'experthub'),
  user: env('DB_USER', 'root'),
  password: env('DB_PASS', ''),
  waitForConnections: true,
  connectionLimit: envInt('DB_POOL_MAX', 10),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
};
