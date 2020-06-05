import { config } from 'app/config/config';
import { inputOutputLogger, performanceLogger } from 'app/loggers/logger';
import { requestScopeContext } from 'app/utilities/request-scope-context';
import { stringUtils } from 'app/utilities/string-utils';
import mung from 'express-mung';
import { RequestHandler } from 'express-serve-static-core';
import { v4 as uuid4 } from 'uuid';

/**
 * Express middleware to set request-scoped context information
 * @param _ unused
 * @param __ unused
 * @param next the next callback
 */
export const logCorrelationMiddleware: RequestHandler = (_, __, next): void => {
	
	requestScopeContext.correlationId = uuid4();
	next();
};

/**
 * Express middleware to log API requests
 * @param req the Express request
 * @param _ unused
 * @param next the next callback
 */
export const requestLoggerMiddleware: RequestHandler = (req, _, next): void => {
	
	const logUrl = req.originalUrl;
	const skipBodyRegExp = config.log.apisInputOutput.excludeRequestBodyRegExp;
	const logBody = skipBodyRegExp.length === 0 || !stringUtils.matches(logUrl, skipBodyRegExp) ? req.body : '{body-log-skipped}';
	inputOutputLogger.info('API %s %s - Received Request: %s', req.method, logUrl, logBody);

	next();
};

/**
 * Express middleware to log API responses
 */
export const responseLoggerMiddleware: RequestHandler = mung.json((body, req, res) => {
   
	const logUrl = req.originalUrl;
	const skipBodyRegExp = config.log.apisInputOutput.excludeResponseBodyRegExp;
	const logBody = skipBodyRegExp.length === 0 || !stringUtils.matches(logUrl, skipBodyRegExp) ? body : '{body-log-skipped}';
	inputOutputLogger.info('API %s %s - Sent Response: %s - %s', req.method, logUrl, res.statusCode, logBody);
	return body;
}, {
	mungError: true
});

/**
 * Express middleware to log a route performance
 * @param req the Express request
 * @param res the Express response
 * @param next the next callback
 */
export const performanceLoggerMiddleware: RequestHandler = (req, res, next): void => {
	
	const startNs = process.hrtime.bigint();

	res.on('finish', () => {

		const endNs = process.hrtime.bigint();
		const elapsedTimeNs = endNs - startNs;
		const elapsedTimeMs = elapsedTimeNs / BigInt(1e6);
		
		performanceLogger.debug('API %s %s took %s ms [%s ns]', req.method, req.originalUrl, elapsedTimeMs, elapsedTimeNs);
	});

	next();
};

