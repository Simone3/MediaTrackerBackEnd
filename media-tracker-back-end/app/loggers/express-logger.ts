import mung from 'express-mung';
import { inputOutputLogger } from './logger';
import { RequestHandler } from 'express-serve-static-core';

/**
 * Express middleware to log API requests
 */
export const expressRequestLogger: RequestHandler = (req, _, next) => {
	
	inputOutputLogger.info('API %s %s - Received Request: %s', req.method, req.originalUrl, req.body);

    next();
};

/**
 * Express middleware to log API responses
 */
export const expressResponseLogger: RequestHandler = mung.json((body, req, res) => {
   
	inputOutputLogger.info('API %s %s - Sent Response: %s - %s', req.method, req.originalUrl, res.statusCode, body);
	return body;
}, {
	mungError: true
});

