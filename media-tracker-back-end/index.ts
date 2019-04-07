import 'reflect-metadata';
import { server } from './app/server';
import { config } from './app/config/config';
import { databaseManager } from './app/controllers/database/database-manager';
import { logger } from './app/loggers/logger';

logger.info('Starting application...');

server.listen(config.server.port, () => {

	databaseManager.initConnection(config.db.url)
		.then(() => {

			logger.info('Server running on port %s', config.server.port);
		})
		.catch((reason) => {

			logger.error('Database connection error: %s, exiting...', reason);
			process.exit(1);
		});
});

