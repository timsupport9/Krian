import fs from 'fs/promises';
import path from 'path';
import logger from '../core/Logger.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (db) => {
  const seedersPath = path.join(__dirname, '../../database/seeders');
  
  try {
    const files = await fs.readdir(seedersPath);
    const jsFiles = files.filter(f => f.endsWith('.js')).sort();

    if (jsFiles.length === 0) {
      logger.info('No seeders found');
      return;
    }

    for (const file of jsFiles) {
      logger.info(`Running seeder: ${file}`);
      
      try {
        const seederPath = path.join(seedersPath, file);
        const seeder = await import(`file://${seederPath}`);
        
        if (typeof seeder.default === 'function') {
          await seeder.default(db);
          logger.info(`✓ Completed seeder: ${file}`);
        } else {
          logger.warn(`Seeder ${file} does not export a default function`);
        }
      } catch (error) {
        logger.error(`✗ Seeder failed: ${file}`, error.message);
        throw error;
      }
    }
    
    logger.info('All seeders completed successfully');
  } catch (error) {
    logger.error('Seeding process failed:', error);
    throw error;
  }
};
