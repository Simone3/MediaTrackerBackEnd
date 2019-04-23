import request, { RequestPromiseOptions } from 'request-promise-native';
import { StatusCodeError, RequestError } from 'request-promise-native/errors';
import { UrlOptions } from 'request';
import { parserValidator } from '../utilities/parser-validator';
import { ClassType } from 'class-transformer-validator';
import { HttpMethod } from '../utilities/misc-utils';
import { AppError } from '../../models/error/error';
import { logger, externalInvocationsInputOutputLogger } from '../../loggers/logger';
import { config } from '../../config/config';

/**
 * Helper controller to invoke external JSON-based REST services
 */
export class RestJsonInvoker {

	/**
	 * Invokes a JSON-based GET external service
	 * @param url the endpoint
	 * @param responseBodyClass the response class, with validators defined as annotations
	 * @param queryParams optional query parameters
	 * @returns a promise that will eventually contain the parsed response body
	 */
	public invokeGet<O extends object>(parameters: InvocationParamsWithoutBody<O>): Promise<O> {

		return this.invokeHelper({
			...parameters,
			method: 'GET'
		});
	}

	/**
	 * Invokes a JSON-based POST external service
	 * @param url the endpoint
	 * @param requestBody the request body
	 * @param responseBodyClass the response class, with validators defined as annotations
	 * @param queryParams optional query parameters
	 * @returns a promise that will eventually contain the parsed response body
	 */
	public invokePost<I extends object, O extends object>(parameters: InvocationParamsWithBody<I, O>): Promise<O> {

		return this.invokeHelper({
			...parameters,
			method: 'POST'
		});
	}

	/**
	 * Internal helper
	 */
	private invokeHelper<I, O extends object>(parameters: InternalInvocationParams<I, O>): Promise<O> {

		return new Promise((resolve, reject) => {

			const options: UrlOptions & RequestPromiseOptions = {
				url: parameters.url,
				method: parameters.method,
				qs: parameters.queryParams,
				body: parameters.requestBody ? JSON.stringify(parameters.requestBody) : parameters.requestBody,
				timeout: parameters.timeoutMilliseconds,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
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
							reject(AppError.EXTERNAL_API_PARSE.unlessAppError(error));
						})
				})
				.catch((error) => {

					logger.error('External API invocation error: %s', error);
					reject(this.invocationErrorToAppError(options, error));
				});
		});
	}
	
	/**
	 * Helper to transform a request() error into an AppError
	 */
	private invocationErrorToAppError(requestOptions: UrlOptions & RequestPromiseOptions, error: any): AppError {

		if(error instanceof StatusCodeError) {

			this.logResponse(requestOptions, error.response);
			return AppError.EXTERNAL_API_INVOKE.withDetails(error);
		}
		else if(error instanceof RequestError) {
			
			let code = (error.error && error.error.code && typeof error.error.code === 'string' ? String(error.error.code) : '');
			if(code.includes('TIMEDOUT')) {
				
				return AppError.EXTERNAL_API_TIMEOUT.withDetails(error);
			}
		}

		return AppError.EXTERNAL_API_GENERIC.withDetails(error);
	}

	/**
	 * Helper to log the invocation request
	 */
	private logRequest(requestOptions: UrlOptions & RequestPromiseOptions): void {

		if(config.log.logExternalApisInputOutput) {
			
			externalInvocationsInputOutputLogger.info('External Service %s %s %s - Sent Request: %s', requestOptions.method, requestOptions.url, requestOptions.qs, requestOptions.body);
		}
	}

	/**
	 * Helper to log the invocation response
	 */
	private logResponse(requestOptions: UrlOptions & RequestPromiseOptions, response: any): void {

		if(config.log.logExternalApisInputOutput) {

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
export type InvocationParamsWithoutBody<O> = {

	url: string,
	responseBodyClass: ClassType<O>,
	timeoutMilliseconds?: number,
	queryParams?: QueryParams
};

/**
 * Helper type for invocation parameters
 */
export type InvocationParamsWithBody<I, O> = InvocationParamsWithoutBody<O> & {

	requestBody: I
};

/**
 * Internal helper type for invocation parameters
 */
type InternalInvocationParams<I, O> = InvocationParamsWithoutBody<O> & Partial<InvocationParamsWithBody<I, O>> & {

	method: HttpMethod
}

/**
 * Helper type for URL query params
 */
export type QueryParams = {
	[key: string]: string
};


