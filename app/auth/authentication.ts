import { logger } from 'app/loggers/logger';
import { requestScopeContext } from 'app/utilities/request-scope-context';
import { Request, RequestHandler, Response } from 'express-serve-static-core';
import { auth } from 'firebase-admin';

/**
 * Helper to extract the authorization header value from the request
 * @param request the request
 * @returns the token value
 */
const getAuthToken = (request: Request): string | undefined => {
	
	if(request.headers.authorization) {
		
		const authorizationHeader = request.headers.authorization.split(' ');
		if(authorizationHeader.length === 2 && authorizationHeader[0] === 'Bearer') {
		
			return authorizationHeader[1];
		}
	}
		
	return undefined;
};

/**
 * Helper to send a 401 error
 * @param response the response
 * @param error the error to log
 */
const onAuthenticationError = (response: Response, error: unknown): void => {

	logger.error('Authentication error: %s', error);

	response
		.status(401)
		.send({ error: 'Unauthorized' });
};

/**
 * Express middleware to check user authentication
 * @param request the request
 * @param response the response
 * @param next the next callback
 */
export const authenticationMiddleware: RequestHandler = (request, response, next): void => {
	
	const authToken = getAuthToken(request);

	// Check auth header presence
	if(!authToken) {

		onAuthenticationError(response, 'Missing or invalid Authorization header');
		return;
	}

	// Verify token via Firebase
	auth().verifyIdToken(authToken)
		.then((userInfo) => {

			// Save the user UID in the request-scoped global map
			requestScopeContext.currentUserId = userInfo.uid;
			next();
		})
		.catch((error) => {

			onAuthenticationError(response, error);
		});
};
