import { config } from 'app/config/config';
import mongoose from 'mongoose';

/**
 * Helper to start the MongoDB connection
 */
export const setupTestDatabaseConnection = (): void => {

	// Init connection on startup
	before((done) => {

		mongoose.connect(config.db.url, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		const db = mongoose.connection;

		db.on('error', (error) => {

			done(`Test database connection error: ${error}`);
		});

		db.once('open', () => {
			
			done();
		});
	});

	// Drop database after each test
	afterEach((done) => {

		mongoose.connection.db.dropDatabase((error) => {

			if(error) {

				done(error);
			}
			else {

				done();
			}
		});
	});

	// Close connection at the end
	after((done) => {
		
		mongoose.connection.close(done);
	});
};
