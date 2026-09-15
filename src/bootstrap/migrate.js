import fs from 'fs/promises';
import path from 'path';
import logger from '../core/Logger.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (db) => {
  const migrationsPath = path.join(__dirname, '../../database/migrations');
  
  try {
    const files = await fs.readdir(migrationsPath);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    if (sqlFiles.length === 0) {
      logger.info('No migrations found');
      return;
    }

    for (const file of sqlFiles) {
      logger.info(`Running migration: ${file}`);
      const sql = await fs.readFile(path.join(migrationsPath, file), 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = sql.split(';').filter(s => s.trim());
      
      try {
        for (const statement of statements) {
          if (statement.trim()) {
            await db.query(statement);
          }
        }
        logger.info(`✓ Completed migration: ${file}`);
      } catch (error) {
        logger.error(`✗ Migration failed: ${file}`, error.message);
        throw error;
      }
    }
    
    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error('Migration process failed:', error);
    throw error;
  }
};
