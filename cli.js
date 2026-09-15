import container from './src/bootstrap/app.js';
import logger from './src/core/Logger.js';

const command = process.argv[2];

const commands = {
  migrate: async () => {
    logger.info('Running migrations...');
    const db = container.make('db');
    try {
      await db.initialize();
      const migrator = await import('./src/bootstrap/migrate.js');
      await migrator.default(db);
      logger.info('Migrations completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Migration failed:', error);
      process.exit(1);
    }
  },

  seed: async () => {
    logger.info('Running seeders...');
    const db = container.make('db');
    try {
      await db.initialize();
      const seeder = await import('./src/bootstrap/seed.js');
      await seeder.default(db);
      logger.info('Seeders completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Seeding failed:', error);
      process.exit(1);
    }
  },

  help: () => {
    console.log(`
ExpertHub CLI Commands:
  migrate              Run pending migrations
  seed                 Run database seeders
  help                 Show this help message
    `);
    process.exit(0);
  },
};

if (!command || !commands[command]) {
  console.error(`Unknown command: ${command}`);
  commands.help();
} else {
  commands[command]();
}
