import { config } from 'app/config/config';
import { AppError } from 'app/data/models/error/error';
import { externalInvocationsInputOutputLogger, logger } from 'app/loggers/logger';
import { HttpMethod } from 'app/utilities/misc-utils';
import { parserValidator } from 'app/utilities/parser-validator';
import { ClassType } from 'class-transformer-validator';
import { UrlOptions } from 'request';
import request, { RequestPromiseOptions } from 'request-promise-native';
import { RequestError, StatusCodeError } from 'request-promise-native/errors';

/**
 * Helper controller to invoke external JSON-based REST services
 */
export class RestJsonInvoker {

	/**
	 * Invokes a JSON-based GET external service
	 * @param parameters the method parameters container
	 * @returns a promise that will eventually contain the parsed response body
	 * @template TResponse the response class
	 */
	public invokeGet<TResponse extends object>(parameters: InvocationParamsWithoutBody<TResponse>): Promise<TResponse> {

		return this.invokeHelper({
			...parameters,
			method: 'GET'
		});
	}

	/**
	 * Invokes a JSON-based POST external service
	 * @param parameters the method parameters container
	 * @returns a promise that will eventually contain the parsed response body
	 * @template TRequest the request class
	 * @template TResponse the response class
	 */
	public invokePost<TRequest extends object, TResponse extends object>(parameters: InvocationParamsWithBody<TRequest, TResponse>): Promise<TResponse> {

		return this.invokeHelper({
			...parameters,
			method: 'POST'
		});
	}

	/**
	 * Internal helper
	 * @param parameters the method parameters container
	 * @returns the 200 service response, as a promise
	 * @template TRequest the request class
	 * @template TResponse the response class
	 */
	private invokeHelper<TRequest extends object, TResponse extends object>(parameters: InternalInvocationParams<TRequest, TResponse>): Promise<TResponse> {

		return new Promise((resolve, reject): void => {

			const options: UrlOptions & RequestPromiseOptions = {
				url: parameters.url,
				method: parameters.method,
				qs: parameters.queryParams,
				body: parameters.requestBody ? JSON.stringify(parameters.requestBody) : parameters.requestBody,
				timeout: parameters.timeoutMilliseconds,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Accept-Charset': 'utf-8',
					'User-Agent': config.externalApis.userAgent
				}
			};

			this.logRequest(options);
		
			request(options)
				.then((rawResponse) => {
	
					this.logResponse(options, rawResponse);

					parserValidator.parseAndValidate(parameters.responseBodyClass, rawResponse)
						.then((parsedResponse) => {
	
							resolve(parsedResponse);
						})
						.catch((error) => {
	
							logger.error('External API response parse error: %s', error);
							reject(AppError.EXTERNAL_API_PARSE.withDetails(error));
						});
				})
				.catch((error) => {

					logger.error('External API invocation error: %s', error);
					reject(this.invocationErrorToAppError(options, error));
				});
		});
	}
	
	/**
	 * Helper to transform a request() error into an AppError
	 * @param requestOptions the invocation data
	 * @param error any error that occurs
	 * @returns an AppError that wraps the given error
	 */
	private invocationErrorToAppError(requestOptions: UrlOptions & RequestPromiseOptions, error: unknown): AppError {

		if(error instanceof StatusCodeError) {

			this.logResponse(requestOptions, error.response);
			return AppError.EXTERNAL_API_INVOKE.withDetails(error);
		}
		else if(error instanceof RequestError) {
			
			const code = error.error && error.error.code && typeof error.error.code === 'string' ? String(error.error.code) : '';
			if(code.includes('TIMEDOUT')) {
				
				return AppError.EXTERNAL_API_TIMEOUT.withDetails(error);
			}
		}

		return AppError.EXTERNAL_API_GENERIC.withDetails(error);
	}

	/**
	 * Helper to log the invocation request
	 * @param requestOptions the invocation data
	 */
	private logRequest(requestOptions: UrlOptions & RequestPromiseOptions): void {

		if(config.log.externalApisInputOutput.active) {
			
			externalInvocationsInputOutputLogger.info('External Service %s %s %s - Sent Request: %s', requestOptions.method, requestOptions.url, requestOptions.qs, requestOptions.body);
		}
	}

	/**
	 * Helper to log the invocation response
	 * @param requestOptions the invocation data
	 * @param response the servive response
	 */
	private logResponse(requestOptions: UrlOptions & RequestPromiseOptions, response: unknown): void {

		if(config.log.externalApisInputOutput.active) {

			externalInvocationsInputOutputLogger.info('External Service %s %s - Received Response: %s', requestOptions.method, requestOptions.url, response);
		}
	}
}

/**
 * Singleton implementation of the JSON REST invoker
 */
export const restJsonInvoker = new RestJsonInvoker();

/**
 * Helper type for invocation parameters
 */
export type InvocationParamsWithoutBody<TResponse> = {
	url: string;
	responseBodyClass: ClassType<TResponse>;
	timeoutMilliseconds?: number;
	queryParams?: QueryParams;
};

/**
 * Helper type for invocation parameters
 */
export type InvocationParamsWithBody<TRequest, TResponse> = InvocationParamsWithoutBody<TResponse> & {
	requestBody: TRequest;
};

/**
 * Internal helper type for invocation parameters
 */
type InternalInvocationParams<TRequest, TResponse> = InvocationParamsWithoutBody<TResponse> & Partial<InvocationParamsWithBody<TRequest, TResponse>> & {
	method: HttpMethod;
}

/**
 * Helper type for URL query params
 */
export type QueryParams = {
	[key: string]: string;
};

