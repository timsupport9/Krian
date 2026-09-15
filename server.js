import container from './src/bootstrap/app.js';
import logger from './src/core/Logger.js';
import { env, envInt } from './src/core/helpers.js';

const port = envInt('APP_PORT', 3000);
const appName = env('APP_NAME', 'ExpertHub');

let server;

const start = async () => {
  try {
    const db = container.make('db');
    await db.initialize();
    
    const app = container.make('app');
    const expressApp = app.getExpress();
    
    server = expressApp.listen(port, () => {
      logger.info(`${appName} server running on port ${port}`);
      logger.info(`Environment: ${env('APP_ENV', 'development')}`);
      logger.info(`URL: ${env('APP_URL', 'http://localhost:3000')}`);
    });

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }
};

start();
