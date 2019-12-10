import { config } from 'app/config/config';
import { AppError } from 'app/data/models/error/error';
import { databaseLogger, logger } from 'app/loggers/logger';
import mongoose, { ConnectionOptions } from 'mongoose';

/**
 * Database controller that handles generic DB setup, like its connection
 */
class DatabaseManager {

	/**
	 * Initializes the database connection
	 * @param databaseUrl the database URL
	 * @returns a void promise that resolves when connection is ready
	 */
	public initConnection(databaseUrl: string): Promise<void> {
		
		return new Promise((resolve, reject): void => {
			
			logger.info('Starting database connection...');

			const options: ConnectionOptions = {
				useNewUrlParser: true
			};

			if(config.log.logDatabaseQueries) {

				mongoose.set('debug', (collection: string, method: string, query: object, document: object): void => {
					
					databaseLogger.info('Accessing collection %s with %s query %s and document %s', collection, method, query, document);
				});
			}
	
			mongoose.connect(databaseUrl, options);
	
			const db = mongoose.connection;
	
			db.on('error', (error): void => {
				
				logger.error('Database connection error: %s', error);
				reject(AppError.DATABASE_INIT.withDetails(error));
			});
	
			db.once('open', (): void => {
	
				logger.info('Database connection opened');
				resolve();
			});
		});
	}

	/**
	 * Closes the database connection
	 * @returns a void promise that resolves when connection is closed
	 */
	public closeConnection(): Promise<void> {

		return mongoose.connection.close(false);
	}
}

export const databaseManager = new DatabaseManager();
