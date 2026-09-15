import { env } from '../core/helpers.js';

export default {
  level: env('LOG_LEVEL', 'info'),
  format: env('LOG_FORMAT', 'pretty'),
  path: 'storage/logs',
};
