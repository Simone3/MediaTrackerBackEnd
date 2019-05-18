
import { config } from 'app/config/config';
import { databaseManager } from 'app/controllers/database/database-manager';
import { finalizeAndCloseAllLoggers, logger } from 'app/loggers/logger';
import { AppError } from 'app/models/error/error';
import { server } from 'app/server/server';
import exitHook from 'exit-hook';

/**
 * Initializes the application
 */
export const init = (): void => {

	logger.info('Starting application...');

	// Start Express
	const serverInstance = server.listen(config.server.port, () => {
	
		// Start MongoDB
		databaseManager.initConnection(config.db.url)
			.then(() => {
	
				logger.info('Server running on port %s', config.server.port);
			})
			.catch((error) => {
	
				logger.error('Database connection error: %s', error);
				throw AppError.DATABASE_INIT.withDetails(error);
			});
	});

	// Graceful shutdown hook
	exitHook(() => {

		logger.info('Received shutdown signal');

		// Shutdown log4js
		finalizeAndCloseAllLoggers();

		// Shutdown Express
		serverInstance.close();

		// Shutdown MongoDB
		databaseManager.closeConnection();
	});
};
