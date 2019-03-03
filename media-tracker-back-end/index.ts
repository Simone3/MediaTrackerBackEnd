import { server } from './app/server';
import { config } from './app/config/config';

server.listen(config.serverPort, () => {

	console.log(`Server running on port ${config.serverPort}`);
});

