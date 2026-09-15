import { env, envInt } from '../core/helpers.js';

export default {
  session: {
    secret: env('SESSION_SECRET', 'your-secret-key'),
    timeout: envInt('SESSION_TIMEOUT', 86400),
    cookie: {
      secure: env('APP_ENV', 'development') === 'production',
      httpOnly: true,
      sameSite: 'strict',
    },
  },
  password: {
    rounds: 10,
  },
  jwt: {
    secret: env('JWT_SECRET', 'your-jwt-secret'),
    expiry: env('JWT_EXPIRY', '7d'),
  },
  lockout: {
    maxAttempts: 5,
    lockoutDuration: 900,
  },
};
