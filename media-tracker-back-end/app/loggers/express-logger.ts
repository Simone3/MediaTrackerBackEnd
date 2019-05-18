import { inputOutputLogger } from 'app/loggers/logger';
import { requestScopeContext } from 'app/utilities/request-scope-context';
import mung from 'express-mung';
import { RequestHandler } from 'express-serve-static-core';
import uuid from 'uuid';

/**
 * Express middleware to set request-scoped context information
 * @param _ unused
 * @param __ unused
 * @param next the next callback
 */
export const logCorrelationMiddleware: RequestHandler = (_, __, next): void => {
	
	requestScopeContext.correlationId = uuid();
	next();
};

/**
 * Express middleware to log API requests
 * @param req the Extress request
 * @param _ unused
 * @param next the next callback
 */
export const requestLoggerMiddleware: RequestHandler = (req, _, next): void => {
	
	inputOutputLogger.info('API %s %s - Received Request: %s', req.method, req.originalUrl, req.body);
	next();
};

/**
 * Express middleware to log API responses
 */
export const responseLoggerMiddleware: RequestHandler = mung.json((body, req, res) => {
   
	inputOutputLogger.info('API %s %s - Sent Response: %s - %s', req.method, req.originalUrl, res.statusCode, body);
	return body;
}, {
	mungError: true
});

