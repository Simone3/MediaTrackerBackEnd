import 'reflect-metadata';
import { testConfig } from 'global/config-test';
import { setupTestAuth } from 'helpers/auth-handler-helper';

// Overwrite the env config
// eslint-disable-next-line no-process-env
process.env.MEDIA_TRACKER_BE_CONFIG = JSON.stringify(testConfig);

// Catch all "unhandledRejection" warnings
process.on('unhandledRejection', (error) => {
	throw error;
});

// Setup global mocks and spies
setupTestAuth();
