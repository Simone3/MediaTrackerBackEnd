import { server } from 'app/server/server';

let serverInstance: any;

/**
 * Helper to start the Express server
 */
export const setupTestServer = (): void => {

	// Init server on startup
	before((done) => {

		serverInstance = server.listen(3123, () => {
		
			done();
		});
	});

	// Close server connection at the end
	after((done) => {
		
		serverInstance.close();
		done();
	});
};

/**
 * Getter for the current test server
 */
export const getTestServer = (): any => {

	return serverInstance;
};
