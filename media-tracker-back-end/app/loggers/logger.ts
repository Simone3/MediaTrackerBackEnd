
import { configure, getLogger, Logger } from 'log4js';
import { config } from '../config/config';

/**
 * Global log4js configuration
 */
configure({
	appenders: {
		file: {
			type: 'dateFile',
			filename: config.log.file
		},
		console: {
			type: 'console'
		}
	},
	categories: {
		default: {
			appenders: ['file', 'console'],
			level: 'debug'
		}
	}
});

/**
 * Application logger
 */
class MediaTrackerLogger {

	private log4js: Logger;

	constructor(logCategory: string) {

		this.log4js = getLogger(logCategory);
		this.log4js.level = config.log.level;
	}

	/**
	 * Writes a debug message if debug is enabled, with optional %s arguments
	 */
	public debug(message: any, ...args: any[]): void {
		
		if(this.log4js.isDebugEnabled()) {

			this.log4js.debug(message, ...this.stringify(args));
		}
	}
	
	/**
	 * Writes an info message if info is enabled, with optional %s arguments
	 */
	public info(message: any, ...args: any[]): void {

		if(this.log4js.isInfoEnabled()) {

			this.log4js.info(message, ...this.stringify(args));
		}
	}

	/**
	 * Writes an error message if error is enabled, with optional %s arguments
	 */
	public error(message: any, ...args: any[]): void{
		
		if(this.log4js.isErrorEnabled()) {

			this.log4js.error(message, ...this.stringify(args));
		}
	}

	/**
	 * Internal helper to write objects as JSON strings
	 */
	private stringify(args: any[]): string[] {

		if(args && args.length > 0) {

			return args.map((arg) => {

				if(arg) {

					if(arg instanceof Object) {

						return JSON.stringify(arg);
					}
					else {

						return arg;
					}
				}
				else {

				}
				return '-';
			});
		}
		else {

			return [];
		}
	}
}

/**
 * Generic logger, used for "manual" application logging
 */
export const logger = new MediaTrackerLogger('Application');

/**
 * Logger for API input-output
 */
export const inputOutputLogger = new MediaTrackerLogger('Input-Output');
