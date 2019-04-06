import mongoose, { ConnectionOptions} from 'mongoose';
import { AppError } from '../../models/error/error';

/**
 * Database controller that handles generic DB setup, like its connection
 */
class DatabaseManager {

	/**
	 * Initializes the database connection
	 */
	public initConnection(databaseUrl: string): Promise<void> {
		
		return new Promise((resolve, reject) => {
			
			var options: ConnectionOptions = {
				useNewUrlParser: true
			};
	
			mongoose.connect(databaseUrl, options);
	
			var db = mongoose.connection;
	
			db.on('error', (error: any) => {
				
				reject(AppError.DATABASE_INIT.unlessAppError(error));
			});
	
			db.once('open', () => {
	
				resolve();
			});
		});
	}
}

export const databaseManager = new DatabaseManager();


