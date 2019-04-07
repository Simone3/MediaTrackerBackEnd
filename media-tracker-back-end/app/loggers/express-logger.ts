import mung from 'express-mung';
import { inputOutputLogger } from './logger';
import { RequestHandler } from 'express-serve-static-core';
import uuid from 'uuid';
import { requestScopeContext } from '../controllers/utilities/request-scope-context';

/**
 * Express middleware to set request-scoped context information 
 */
export const logCorrelationMiddleware: RequestHandler = (_, __, next) => {
	
	requestScopeContext.correlationId = uuid();

    next();
};

/**
 * Express middleware to log API requests
 */
export const requestLoggerMiddleware: RequestHandler = (req, _, next) => {
	
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

