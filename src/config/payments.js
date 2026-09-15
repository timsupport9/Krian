import { env } from '../core/helpers.js';

export default {
  driver: env('PAYMENT_DRIVER', 'mpesa'),
  mpesa: {
    key: env('MPESA_KEY', ''),
    secret: env('MPESA_SECRET', ''),
  },
  paypal: {
    clientId: env('PAYPAL_CLIENT_ID', ''),
    clientSecret: env('PAYPAL_CLIENT_SECRET', ''),
  },
  stripe: {
    publicKey: env('STRIPE_KEY', ''),
    secretKey: env('STRIPE_SECRET', ''),
  },
};
