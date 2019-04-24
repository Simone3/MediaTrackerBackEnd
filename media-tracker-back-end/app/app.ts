
import { config } from 'app/config/config';
import { databaseManager } from 'app/controllers/database/database-manager';
import { finalizeAndCloseAllLoggers, logger } from 'app/loggers/logger';
import { server } from 'app/server/server';
import exitHook from 'exit-hook';

/**
 * Initializes the application
 */
export const init = () => {

	logger.info('Starting application...');

	// Start Express
	const serverInstance = server.listen(config.server.port, () => {
	
		// Start MongoDB
		databaseManager.initConnection(config.db.url)
			.then(() => {
	
				logger.info('Server running on port %s', config.server.port);
			})
			.catch((error) => {
	
				logger.error('Database connection error: %s, exiting...', error);
				process.exit(1);
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