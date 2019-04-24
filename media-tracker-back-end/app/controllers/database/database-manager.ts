import { config } from 'app/config/config';
import { databaseLogger, logger } from 'app/loggers/logger';
import { AppError } from 'app/models/error/error';
import mongoose, { ConnectionOptions } from 'mongoose';

/**
 * Database controller that handles generic DB setup, like its connection
 */
class DatabaseManager {

	/**
	 * Initializes the database connection
	 */
	public initConnection(databaseUrl: string): Promise<void> {
		
		return new Promise((resolve, reject): void => {
			
			logger.info('Starting database connection...');

			var options: ConnectionOptions = {
				useNewUrlParser: true
			};

			if(config.log.logDatabaseQueries) {

				mongoose.set('debug', (collection: string, method: string, query: object, document: object): void => {
					
					databaseLogger.info('Accessing collection %s with %s query %s and document %s', collection, method, query, document);
				});
			}
	
			mongoose.connect(databaseUrl, options);
	
			var db = mongoose.connection;
	
			db.on('error', (error): void => {
				
				logger.error('Database connection error: %s', error);
				reject(AppError.DATABASE_INIT.unlessAppError(error));
			});
	
			db.once('open', (): void => {
	
				logger.info('Database connection opened');
				resolve();
			});
		});
	}

	/**
	 * Closes the database connection
	 */
	public closeConnection(): Promise<void> {

		return mongoose.connection.close(false);
	}
}

export const databaseManager = new DatabaseManager();


