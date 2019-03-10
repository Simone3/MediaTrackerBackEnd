import 'reflect-metadata';
import { server } from './app/server';
import { config } from './app/config/config';
import { database } from './app/controllers/database';

server.listen(config.serverPort, () => {

	database.setup(config.databaseUrl)
		.then(() => {

			console.log(`Server running on port ${config.serverPort}`);
		})
		.catch((reason) => {

			console.error('Database connection error, exiting...', reason);
			process.exit(1);
		});
});

