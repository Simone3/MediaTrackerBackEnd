
import { config } from 'app/config/config';
import { requestScopeContext } from 'app/controllers/utilities/request-scope-context';
import { logRedactor } from 'app/loggers/log-redactor';
import { configure, getLogger, Logger, PatternLayout, shutdown } from 'log4js';

/**
 * Pattern layout for log4js
 */
const layout: PatternLayout = {
	type: 'pattern',
	pattern: '[%d] [%x{correlationId}] %p %c - %m',
	tokens: {
		correlationId: () => {

			return requestScopeContext.correlationId || 'NONE';
		}
	}
};

/**
 * Global log4js configuration
 */
configure({
	appenders: {
		file: {
			type: 'dateFile',
			filename: config.log.file,
			layout: layout
		},
		console: {
			type: 'console',
			layout: layout
		}
	},
	categories: {
		default: {
			appenders: [ 'file', 'console' ],
			level: 'debug'
		}
	}
});

/**
 * Application logger
 */
class MediaTrackerLogger {

	private log4js: Logger;

	public constructor(logCategory: string) {

		this.log4js = getLogger(logCategory);
		this.log4js.level = config.log.level;
	}

	/**
	 * Writes a debug message if debug is enabled, with optional %s arguments
	 */
	public debug(message: string, ...args: unknown[]): void {
		
		if(this.log4js.isDebugEnabled()) {

			this.log4js.debug(message, ...this.stringify(args));
		}
	}
	
	/**
	 * Writes an info message if info is enabled, with optional %s arguments
	 */
	public info(message: string, ...args: unknown[]): void {

		if(this.log4js.isInfoEnabled()) {

			this.log4js.info(message, ...this.stringify(args));
		}
	}

	/**
	 * Writes an error message if error is enabled, with optional %s arguments
	 */
	public error(message: string, ...args: unknown[]): void{
		
		if(this.log4js.isErrorEnabled()) {

			this.log4js.error(message, ...this.stringify(args));
		}
	}

	/**
	 * Internal helper to write objects as JSON strings
	 */
	private stringify(args: unknown[]): string[] {

		if(args && args.length > 0) {

			return args.map((arg) => {

				return logRedactor.processAndStringify(arg).replace(/\r?\n|\r|\t/g, ' ');
			});
		}
		else {

			return [];
		}
	}
}

/**
 * Generic logger, used for 'manual' application logging
 */
export const logger = new MediaTrackerLogger('Application');

/**
 * Logger for APIs input-output
 */
export const inputOutputLogger = new MediaTrackerLogger('Input-Output');

/**
 * Logger for external APIs input-output
 */
export const externalInvocationsInputOutputLogger = new MediaTrackerLogger('External-API');

/**
 * Logger for database queries
 */
export const databaseLogger = new MediaTrackerLogger('Database');

/**
 * Callback to gracefully close all loggers
 */
export const finalizeAndCloseAllLoggers = (): void => {

	shutdown();
};
