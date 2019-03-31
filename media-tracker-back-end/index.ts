import 'reflect-metadata';
import { server } from './app/server';
import { config } from './app/config/config';
import { databaseManager } from './app/controllers/database/database-manager';

server.listen(config.serverPort, () => {

	databaseManager.initConnection(config.databaseUrl)
		.then(() => {

			console.log(`Server running on port ${config.serverPort}`);
		})
		.catch((reason) => {

			console.error('Database connection error, exiting...', reason);
			process.exit(1);
		});
});

