import { config } from 'app/config/config';
import { AppError } from 'app/data/models/error/error';
import { externalInvocationsInputOutputLogger, logger, performanceLogger } from 'app/loggers/logger';
import { InvocationParams } from 'app/utilities/helper-types';
import { parserValidator } from 'app/utilities/parser-validator';
import axios, { AxiosError, AxiosRequestConfig, Cancel } from 'axios';

/**
 * Helper controller to invoke external JSON-based REST services
 */
export class RestJsonInvoker {

	private readonly TIMEOUT_CANCEL_MESSAGE = 'custom-timeout';

	/**
	 * Invokes a JSON-based service
	 * @param parameters the method parameters container
	 * @returns the 200 service response, as a promise
	 * @template TRequest the request class
	 * @template TResponse the response class
	 */
	public invoke<TRequest extends object | undefined, TResponse extends object>(parameters: InvocationParams<TRequest, TResponse>): Promise<TResponse> {

		const startNs = process.hrtime.bigint();

		return new Promise((resolve, reject): void => {

			// Build request options
			const cancelTokenSource = axios.CancelToken.source();
			const options: AxiosRequestConfig = {
				url: parameters.url,
				method: parameters.method,
				params: parameters.queryParams,
				data: parameters.requestBody ? JSON.stringify(parameters.requestBody) : parameters.requestBody,
				cancelToken: cancelTokenSource.token,
				headers: {
					...parameters.headers,
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Accept-Charset': 'utf-8',
					'User-Agent': config.externalApis.userAgent
				}
			};
			this.logRequest(options);

			// Custom timeout handling (timeout field in options only handles connection timeout)
			const timeout = parameters.timeoutMilliseconds ? parameters.timeoutMilliseconds : config.externalApis.timeoutMilliseconds;
			setTimeout(() => {
				cancelTokenSource.cancel(this.TIMEOUT_CANCEL_MESSAGE);
			}, timeout);

			// Execute request via promises
			axios.request(options)
				.then((axiosResponse) => {
	
					const rawResponseBody = axiosResponse.data;
					this.logSuccessfulResponse(options, rawResponseBody);
					this.logPerformance(options, startNs);

					// Check if we "trust" the API response to be valid...
					if(parameters.assumeWellFormedResponse) {

						// Skip validation and return the raw response
						resolve(rawResponseBody);
					}
					else {

						// Parse and validate the raw response
						parserValidator.parseAndValidate(parameters.responseBodyClass, rawResponseBody)
							.then((parsedResponse) => {
		
								resolve(parsedResponse);
							})
							.catch((error) => {
		
								logger.error('External API response parse error: %s', error);
								reject(AppError.EXTERNAL_API_PARSE.withDetails(error));
							});
					}
				})
				.catch((error) => {

					logger.error('External API invocation error: %s', error);

					if(this.isTimeout(error)) {

						reject(AppError.EXTERNAL_API_TIMEOUT.withDetails(error));
					}
					else {
						
						reject(AppError.EXTERNAL_API_GENERIC.withDetails(error));
					}
				});
		});
	}

	/**
	 * Helper to determine if the back-end invocation timed out
	 * @param error the generic error
	 * @returns true if it's a timeout error
	 */
	private isTimeout(error: unknown): boolean {

		if(this.isAxiosError(error)) {

			const axiosError = error as AxiosError;
			return (axiosError.response && axiosError.response.status === 408) || axiosError.code === 'ECONNABORTED';
		}
		
		return this.isCancelError(error);
	}

	/**
	 * Helper to check if a generic error is an AxiosError
	 * @param error the generic error
	 * @returns true if it's an AxiosError
	 */
	private isAxiosError(error: unknown): boolean {

		if(error) {

			const possiblyAxiosError = error as AxiosError;
			return possiblyAxiosError.isAxiosError;
		}

		return false;
	}

	/**
	 * Helper to check if a generic error is the timeout cancel error
	 * @param error the generic error
	 * @returns true if it's the timeout cancel error
	 */
	private isCancelError(error: unknown): boolean {

		if(error) {

			const possiblyCancel = error as Cancel;
			return possiblyCancel.message === this.TIMEOUT_CANCEL_MESSAGE;
		}

		return false;
	}

	/**
	 * Helper to log the request
	 * @param options the request options
	 */
	private logRequest(options: AxiosRequestConfig): void {
		
		if(config.log.externalApisInputOutput.active) {

			externalInvocationsInputOutputLogger.info('External Service %s %s %s - Sent Request: %s', options.method, options.url, options.params, options.data);
		}
	}

	/**
	 * Helper to log the successful response
	 * @param options the request options
	 * @param rawResponseBody the response body
	 */
	private logSuccessfulResponse(options: AxiosRequestConfig, rawResponseBody: unknown): void {
		
		if(config.log.externalApisInputOutput.active) {

			externalInvocationsInputOutputLogger.info('External Service %s %s - Received Response: %s', options.method, options.url, rawResponseBody);
		}
	}

	/**
	 * Helper to log the invocation performance
	 * @param options the request options
	 * @param startNs the invocation start
	 */
	private logPerformance(options: AxiosRequestConfig, startNs: bigint): void {

		if(config.log.performance.active) {

			const endNs = process.hrtime.bigint();
			const elapsedTimeNs = endNs - startNs;
			const elapsedTimeMs = elapsedTimeNs / BigInt(1e6);
			
			performanceLogger.debug('External Service %s %s took %s ms [%s ns]', options.method, options.url, elapsedTimeMs, elapsedTimeNs);
		}
	}
}

/**
 * Singleton implementation of the JSON REST invoker
 */
export const restJsonInvoker = new RestJsonInvoker();
