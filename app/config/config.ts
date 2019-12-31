import { Config } from 'app/config/type-config';
import { AppError } from 'app/data/models/error/error';
import { parserValidator } from 'app/utilities/parser-validator';

// Get the configuration environment variable
// eslint-disable-next-line no-process-env
const configVar = process.env.MEDIA_TRACKER_BE_CONFIG;

let parsedConfigVar: object;
if(configVar) {

	// If the environment variable was found, parse it as a JSON
	try {

		parsedConfigVar = JSON.parse(configVar);
	}
	catch(error) {

		throw AppError.GENERIC.withDetails(`MEDIA_TRACKER_BE_CONFIG environment variable is not a valid JSON: ${error}`);
	}
}
else {

	// If the environment variable was not found, try to get a "MEDIA_TRACKER_BE_CONFIG.json" from the root directory
	try {

		// eslint-disable-next-line global-require
		parsedConfigVar = require('MEDIA_TRACKER_BE_CONFIG.json');
	}
	catch(error) {

		throw AppError.GENERIC.withDetails(`MEDIA_TRACKER_BE_CONFIG environment variable not defined and no MEDIA_TRACKER_BE_CONFIG.json found: ${error}`);
	}

	if(!parsedConfigVar) {

		throw AppError.GENERIC.withDetails('MEDIA_TRACKER_BE_CONFIG.json found but is empty');
	}
}

// Validate the object as a "Config" instance
try {

	// eslint-disable-next-line no-sync
	parserValidator.parseAndValidateSync(Config, parsedConfigVar);
}
catch(error) {

	throw AppError.GENERIC.withDetails(`MEDIA_TRACKER_BE_CONFIG environment variable is not a valid "Config" instance: ${error}`);
}

// The final result is not the parsed "Config" instance (constructor, etc. overhead) but the original object that can be safely cast to Config
const envConfig = parsedConfigVar as Config;

/**
 * The application centralized configuration properties, varies by environment and during automatic testing
 */
export const config: Config = envConfig;
