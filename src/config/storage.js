import { env, envInt } from '../core/helpers.js';

export default {
  driver: env('STORAGE_DRIVER', 'local'),
  local: {
    root: env('UPLOAD_PATH', 'storage/uploads'),
    url: env('APP_URL', 'http://localhost:3000') + '/uploads',
  },
  limit: envInt('UPLOAD_LIMIT', 52428800),
};
