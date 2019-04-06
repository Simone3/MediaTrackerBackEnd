import 'reflect-metadata';
import { server } from './app/server';
import { config } from './app/config/config';
import { databaseManager } from './app/controllers/database/database-manager';

server.listen(config.server.port, () => {

	databaseManager.initConnection(config.db.url)
		.then(() => {

			console.log(`Server running on port ${config.server.port}`);
		})
		.catch((reason) => {

			console.error('Database connection error, exiting...', reason);
			process.exit(1);
		});
});

