
import { server } from './server/server';
import { config } from './config/config';
import { databaseManager } from './controllers/database/database-manager';
import { logger } from './loggers/logger';

/**
 * Initializes the application
 */
export const init = () => {

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
};