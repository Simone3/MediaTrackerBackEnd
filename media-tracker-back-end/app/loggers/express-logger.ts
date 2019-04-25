import { requestScopeContext } from 'app/controllers/utilities/request-scope-context';
import { inputOutputLogger } from 'app/loggers/logger';
import mung from 'express-mung';
import { RequestHandler } from 'express-serve-static-core';
import uuid from 'uuid';

/**
 * Express middleware to set request-scoped context information
 */
export const logCorrelationMiddleware: RequestHandler = (_, __, next): void => {
	
	requestScopeContext.correlationId = uuid();
	next();
};

/**
 * Express middleware to log API requests
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

