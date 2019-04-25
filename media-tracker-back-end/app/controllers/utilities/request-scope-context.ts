import httpContext from 'express-http-context';

/**
 * A context that sets and gets request-scoped data (i.e. data can be different for each API request-response cycle)
 */
class RequestScopeContext {

	private readonly CORRELATION_ID = 'correlation-id';

	/**
	 * The current correlation ID
	 */
	public get correlationId(): string | undefined {

		return httpContext.get(this.CORRELATION_ID);
	}
	
	public set correlationId(value: string | undefined) {
		
		httpContext.set(this.CORRELATION_ID, value);
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
