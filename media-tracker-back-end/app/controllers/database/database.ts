import mongoose, { ConnectionOptions} from 'mongoose';

/**
 * Database controller that allows to initialize the data connection
 */
class DatabaseController {

	/**
	 * Initializes the database connection
	 */
	public setup(databaseUrl: string): Promise<void> {
		
		return new Promise((resolve, reject) => {
			
			var options: ConnectionOptions = {
				useNewUrlParser: true
			};
	
			mongoose.connect(databaseUrl, options);
	
			var db = mongoose.connection;
	
			db.on('error', (err: any) => {
				
				reject(err);
			});
	
			db.once('open', () => {
	
				resolve();
			});
		});
	}
}

export const database: DatabaseController = new DatabaseController();


