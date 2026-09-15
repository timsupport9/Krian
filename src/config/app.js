import { env, envBool, envInt } from '../core/helpers.js';

export default {
  name: env('APP_NAME', 'ExpertHub'),
  env: env('APP_ENV', 'development'),
  debug: envBool('APP_DEBUG', false),
  port: envInt('APP_PORT', 3000),
  url: env('APP_URL', 'http://localhost:3000'),
  timezone: 'Africa/Nairobi',
};
