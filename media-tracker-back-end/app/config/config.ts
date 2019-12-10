import { devConfig } from 'app/config/config-dev';
import { testConfig } from 'app/config/config-test';
import { Config } from 'app/config/type-config';
import { AppError } from 'app/data/models/error/error';

/**
 * The application expects to find several configuration files:
 * - config-dev.ts for development environment
 * - config-test.ts for automatic testing
 * - config-prod.ts for production environment
 *
 * In general, config-{ENV}.ts where {ENV} is defined by the MEDIA_TRACKER_BE_ENV environment variable
 *
 * config-dev.ts and config-prod.ts are NOT versioned (e.g. because of API keys). They can be defined starting from
 * the helper config-sample.ts
 */

// eslint-disable-next-line no-process-env
const environment = process.env.MEDIA_TRACKER_BE_ENV;

// Get config based on environment
let envConfig: Config;
switch(environment) {

	case 'dev':
		envConfig = devConfig;
		break;

	case 'test':
		envConfig = testConfig;
		break;

	default:
		throw AppError.GENERIC.withDetails('MEDIA_TRACKER_BE_ENV environment property is not set or is not recognized');
}

/**
 * The application centralized configuration properties, varies by environment and during automatic testing
 */
export const config: Config = envConfig;
