import { envBool } from '../core/helpers.js';

export default {
  videoConsultation: envBool('FEATURE_VIDEO_CONSULTATION', true),
  corporateTraining: envBool('FEATURE_CORPORATE_TRAINING', true),
  webinars: envBool('FEATURE_WEBINARS', true),
  blog: envBool('FEATURE_BLOG', true),
  resources: envBool('FEATURE_RESOURCES', true),
};
