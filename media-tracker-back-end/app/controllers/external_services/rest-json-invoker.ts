import request, { RequestPromiseOptions } from 'request-promise-native';
import { UrlOptions } from 'request';
import { parserValidator } from '../utilities/parser-validator';
import { ClassType } from 'class-transformer-validator';
import { HttpMethod } from '../utilities/misc-utils';

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
	public invokeGet <O extends object> (url: string, responseBodyClass: ClassType<O>, queryParams?: QueryParams): Promise<O> {

		return this.invokeHelper('GET', url, queryParams, undefined, responseBodyClass);
	}

	/**
	 * Invokes a JSON-based POST external service
	 * @param url the endpoint
	 * @param requestBody the request body
	 * @param responseBodyClass the response class, with validators defined as annotations
	 * @param queryParams optional query parameters
	 * @returns a promise that will eventually contain the parsed response body
	 */
	public invokePost <I, O extends object> (url: string, requestBody: I, responseBodyClass: ClassType<O>, queryParams?: QueryParams): Promise<O> {

		return this.invokeHelper('POST', url, queryParams, requestBody, responseBodyClass);
	}

	/**
	 * Internal helper
	 */
	private invokeHelper <I, O extends object> (method: HttpMethod, url: string, queryParams: QueryParams | undefined, requestBody: I | undefined, responseBodyClass: ClassType<O>): Promise<O> {

		return new Promise((resolve, reject) => {

			const options: UrlOptions & RequestPromiseOptions = {
				url: url,
				method: method,
				qs: queryParams,
				body: requestBody ? JSON.stringify(requestBody) : requestBody,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Accept-Charset': 'utf-8'
				}
			};
		
			request(options)
				.then((rawResponse) => {
	
					parserValidator.parseAndValidate(responseBodyClass, rawResponse)
						.then((parsedResponse) => {
	
							resolve(parsedResponse);
						})
						.catch((error) => {
	
							reject("External service response parsing error: " + error);
						})
				})
				.catch((error) => {

					reject("External service invocation error: " + error);
				});
		});
	}
}

/**
 * Singleton implementation of the JSON REST invoker
 */
export const restJsonInvoker = new RestJsonInvoker();

/**
 * Helper type for URL query params
 */
export type QueryParams = {
	[key: string]: string
};



