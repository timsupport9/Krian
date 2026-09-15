import { env } from '../core/helpers.js';

export default {
  driver: env('SMS_DRIVER', 'twilio'),
  twilio: {
    accountSid: env('TWILIO_ACCOUNT_SID', ''),
    authToken: env('TWILIO_AUTH_TOKEN', ''),
    fromNumber: env('TWILIO_PHONE', ''),
  },
};
