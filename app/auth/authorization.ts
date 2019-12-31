import { logger } from 'app/loggers/logger';
import { requestScopeContext } from 'app/utilities/request-scope-context';
import { RequestHandler, Response } from 'express-serve-static-core';

/**
 * Helper to send a 403 error
 * @param response the response
 * @param error the error to log
 */
const onAuthorizationError = (response: Response, error: unknown): void => {

	logger.error('Authorization error: %s', error);

	response
		.status(403)
		.send({ error: 'Forbidden' });
};

/**
 * Express middleware to check that the current user can access the requested user resources.
 * Must be used only for routes with the userId path param.
 * @param request the request
 * @param response the response
 * @param next the next callback
 */
export const userResourceAuthorizationMiddleware: RequestHandler = (request, response, next): void => {
	
	const userIdParam: string | undefined = request.params.userId;
	const currentUserId = requestScopeContext.currentUserId;

	if(!userIdParam || !currentUserId) {

		logger.error('userResourceAuthorizationMiddleware not configured correctly');
		response.status(500);
		return;
	}

	// At the moment, a user can only access his/her own resources only
	if(userIdParam !== currentUserId) {

		onAuthorizationError(response, `Trying to access other user resources: requested is ${userIdParam} but current is ${currentUserId}`);
	}
	else {

		next();
	}
};
