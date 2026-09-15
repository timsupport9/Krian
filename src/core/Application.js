import logger from './Logger.js';

export default class Application {
  constructor(express, container) {
    this.express = express;
    this.container = container;
  }

  getExpress() {
    return this.express;
  }

  getContainer() {
    return this.container;
  }

  make(name, ...params) {
    return this.container.make(name, ...params);
  }

  async run() {
    try {
      await this.container.make('db').initialize();
      logger.info('Application initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize application:', error);
      throw error;
    }
  }

  async shutdown() {
    try {
      await this.container.make('db').close();
      logger.info('Application shutdown complete');
    } catch (error) {
      logger.error('Error during shutdown:', error);
    }
  }
}
