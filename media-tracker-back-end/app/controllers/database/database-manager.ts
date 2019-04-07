import mongoose, { ConnectionOptions} from 'mongoose';
import { AppError } from '../../models/error/error';
import { logger } from '../../loggers/logger';

/**
 * Database controller that handles generic DB setup, like its connection
 */
class DatabaseManager {

	/**
	 * Initializes the database connection
	 */
	public initConnection(databaseUrl: string): Promise<void> {
		
		return new Promise((resolve, reject) => {
			
			logger.info('Starting database connection...');

			var options: ConnectionOptions = {
				useNewUrlParser: true
			};
	
			mongoose.connect(databaseUrl, options);
	
			var db = mongoose.connection;
	
			db.on('error', (error: any) => {
				
				logger.error('Database connection error: %s', error);
				reject(AppError.DATABASE_INIT.unlessAppError(error));
			});
	
			db.once('open', () => {
	
				logger.info('Database connection opened');
				resolve();
			});
		});
	}
}

export const databaseManager = new DatabaseManager();


