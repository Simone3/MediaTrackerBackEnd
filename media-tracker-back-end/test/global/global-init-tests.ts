import 'reflect-metadata';
import { setupTestAuth } from 'helpers/auth-handler-helper';

// Overwrite the env property, for configurations
// eslint-disable-next-line no-process-env
process.env.MEDIA_TRACKER_BE_ENV = 'test';

// Setup global mocks and spies
setupTestAuth();
