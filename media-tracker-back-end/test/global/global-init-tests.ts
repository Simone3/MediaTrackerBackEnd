import 'reflect-metadata';
import { setupTestAuth } from 'helpers/auth-handler-helper';

// Overwrite the env property, for configurations
// eslint-disable-next-line no-process-env
process.env.MEDIA_TRACKER_BE_ENV = 'test';

// Catch all "unhandledRejection" warnings
process.on('unhandledRejection', (error) => {
	throw error;
});

// Setup global mocks and spies
setupTestAuth();
