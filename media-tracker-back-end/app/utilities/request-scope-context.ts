import httpContext from 'express-http-context';

/**
 * A context that sets and gets request-scoped data (i.e. data can be different for each API request-response cycle)
 */
class RequestScopeContext {

	private readonly CURRENT_USER_ID = 'current-user-id';
	private readonly CORRELATION_ID = 'correlation-id';

	/**
	 * The current correlation ID
	 * @returns current correlation ID
	 */
	public get correlationId(): string | undefined {

		return httpContext.get(this.CORRELATION_ID);
	}
	
	public set correlationId(value: string | undefined) {
		
		httpContext.set(this.CORRELATION_ID, value);
	}

	/**
	 * The current user ID
	 * @returns current user ID
	 */
	public get currentUserId(): string {

		return httpContext.get(this.CURRENT_USER_ID);
	}
	
	public set currentUserId(value: string) {
		
		httpContext.set(this.CURRENT_USER_ID, value);
	}
}

/**
 * A context that sets and gets request-scoped data (i.e. data can be different for each API request-response cycle)
 */
export const requestScopeContext = new RequestScopeContext();

/**
 * Middleware to activate the request-scoped context, should be one of the first middlewares added to the Express app
 */
export const requestScopeContextMiddleware = httpContext.middleware;
