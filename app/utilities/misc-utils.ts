import { PathParams } from './helper-types';

/**
 * Enum for HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

/**
 * Helper class with misc useful methods
 */
class MiscUtils {

	/**
	 * Helper to RegExp-escape a string
	 * @param string the source string, optionally containing RegExp characters
	 * @returns the sanitized string
	 */
	public escapeRegExp(string: string): string {

		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	/**
	 * Helper to build a URL
	 * @param urlParts list of URL parts to be appended in order
	 * @param pathParams optional path params to replace in the full URL (the URL string must contain them in the ':' notation, e.g. http://mywebsite.com/:myPathParam/mypage)
	 * @returns the final URL
	 */
	public buildUrl(urlParts: string[], pathParams?: PathParams): string {

		// Empty case
		if(!urlParts || urlParts.length === 0) {
			return '';
		}
		
		// Build full URL
		let fullUrl = urlParts[0] ? urlParts[0] : '';
		for(let i = 1; i < urlParts.length; i++) {

			if(urlParts[i] && urlParts[i].length > 0) {

				const fullEnds = fullUrl.endsWith('/');
				const partStarts = urlParts[i].startsWith('/');
				if(fullEnds && partStarts) {
					
					fullUrl += urlParts[i].substring(1);
				}
				else if(!fullEnds && !partStarts) {

					fullUrl += `/${urlParts[i]}`;
				}
				else {

					fullUrl += urlParts[i];
				}
			}
		}

		// Replace path params
		if(pathParams) {

			for(const key in pathParams) {

				fullUrl = fullUrl.replace(`:${key}`, pathParams[key]);
			}
		}
		
		return fullUrl;
	}

	/**
	 * Parses a boolean from a value of any type (e.g. the string 'false' maps to the boolean false)
	 * @param value any value
	 * @returns the corresponding boolean value
	 */
	public parseBoolean(value: unknown): boolean {

		if(typeof value === 'string') {

			value = value.trim().toLowerCase();
		}

		switch(value) {

			case true:
			case 'true':
			case 1:
			case '1':
			case 'on':
			case 'yes':
				return true;

			default:
				return false;
		}
	}

	/**
	 * Similar to Promise.all but the resulting promise contains the sum of all results
	 * @param sourcePromises the promises to merge
	 * @returns a promise containing the total sum of the results
	 */
	public mergeAndSumPromiseResults(sourcePromises: Promise<number[] | number>[]): Promise<number> {

		return new Promise((resolve, reject) => {

			Promise.all(sourcePromises)
				.then((results) => {

					let totalCount = 0;
					for(const result of results) {

						if(result instanceof Array) {

							totalCount += result.reduce((prev, curr) => {
								return prev + curr;
							});
						}
						else {

							totalCount += result;
						}
					}

					resolve(totalCount);
				})
				.catch((error) => {

					reject(error);
				});
		});
	}

	/**
	 * Extracts the "field" values for each element of the array, as trimmed and ordered strings removing empty or undefined values
	 * @param array the source array, possibly undefined
	 * @param field the field to extract
	 * @returns undefined if array is undefined or empty, the list of sorted strings otherwise
	 */
	public extractFilterAndSortFieldValues<V extends object>(array: V[] | undefined, field: keyof V): string[] | undefined {
		
		if(!array) {

			return undefined;
		}

		return this.filterAndSortValues(array.map((value) => {
			return String(value[field]);
		}));
	}

	/**
	 * Trims and orders strings removing empty or undefined values
	 * @param array the source array, possibly undefined
	 * @returns undefined if array is undefined or empty, the list of sorted strings otherwise
	 */
	public filterAndSortValues(array: string[] | undefined): string[] | undefined {
		
		if(!array) {

			return undefined;
		}

		const strings = array.map((value) => {
			return value.trim();
		}).filter((value) => {
			return value;
		}).sort();

		return strings.length > 0 ? strings : undefined;
	}

	/**
	 * Trasforms a source object (it can also be a class instance) in a key-value map
	 * @param source the source object
	 * @returns the string -> string map
	 */
	public objectToStringKeyValue<T extends object>(source: T): {[key: string]: string} {

		const result: {[key: string]: string} = {};
		const assigned = Object.assign({}, source);
		for(const key in assigned) {

			result[key] = String(assigned[key]);
		}
		return result;
	}
}

/**
 * Singleton implementation of the misc utilities
 */
export const miscUtils = new MiscUtils();
