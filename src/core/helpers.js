export function env(key, defaultValue = undefined) {
  const value = process.env[key];
  return value !== undefined ? value : defaultValue;
}

export function envBool(key, defaultValue = false) {
  const value = env(key);
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
}

export function envInt(key, defaultValue = 0) {
  const value = env(key);
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function now() {
  return new Date();
}

export function today() {
  return new Date().toISOString().split('T')[0];
}

export function isProduction() {
  return env('APP_ENV', 'development') === 'production';
}

export function isDevelopment() {
  return env('APP_ENV', 'development') === 'development';
}
