import { env } from '../core/helpers.js';

export default {
  driver: env('VIDEO_DRIVER', 'zoom'),
  zoom: {
    clientId: env('ZOOM_CLIENT_ID', ''),
    clientSecret: env('ZOOM_CLIENT_SECRET', ''),
  },
};
