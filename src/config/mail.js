import { env, envInt } from '../core/helpers.js';

export default {
  driver: env('MAIL_DRIVER', 'smtp'),
  from: env('MAIL_FROM', 'noreply@experthub.com'),
  smtp: {
    host: env('MAIL_HOST', 'smtp.mailtrap.io'),
    port: envInt('MAIL_PORT', 587),
    auth: {
      user: env('MAIL_USER', ''),
      pass: env('MAIL_PASS', ''),
    },
  },
};
