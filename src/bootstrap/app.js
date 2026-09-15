import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import Container from '../core/Container.js';
import Database from '../core/Database.js';
import Logger from '../core/Logger.js';
import Application from '../core/Application.js';
import config from '../config/index.js';

const container = new Container();

// Register configuration
container.singleton('config', () => config);

// Register logger
container.singleton('logger', () => new Logger(config.logging.level));
const logger = container.make('logger');

// Register database
container.singleton('db', () => {
  const db = new Database(config.database);
  return db;
});

// Create Express app
const expressApp = express();

// Trust proxy
express App.set('trust proxy', 1);

// Middleware
express App.use(helmet());
express App.use(cors({ 
  origin: config.app.url,
  credentials: true 
}));
express App.use(compression());
express App.use(express.json({ limit: '50mb' }));
express App.use(express.urlencoded({ limit: '50mb', extended: true }));
express App.use(cookieParser());

// Setup view engine
express App.set('view engine', 'ejs');
express App.set('views', './src/views');

// Static files
express App.use(express.static('./public'));

// Request logger middleware
express App.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
express App.get('/health', (req, res) => {
  res.json({ status: 'ok', app: config.app.name, timestamp: new Date() });
});

// Register Application class
const app = new Application(expressApp, container);
container.singleton('app', () => app);

// Error handler (basic)
express App.use((err, req, res, next) => {
  logger.error('Request error:', err);
  res.status(err.status || 500).json({
    error: config.app.debug ? err.message : 'Internal Server Error',
    status: err.status || 500,
  });
});

// 404 handler
express App.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    status: 404,
  });
});

export default container;
export { expressApp, app };
