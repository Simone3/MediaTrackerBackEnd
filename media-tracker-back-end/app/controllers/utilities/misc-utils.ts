/**
 * Enum for HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

/**
 * Helper controller that contains misc useful methods
 */
class MiscUtilsController {

	/**
	 * Helper to RegExp-escape a string
	 */
	public escapeRegExp(string: string): string {

		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	/**
	 * Helper to build a URL
	 * @param urlParts list of URL parts to be appended in order
	 * @param pathParams optional path params to replace in the full URL (the URL string must contain them in the ':' notation, e.g. http://mywebsite.com/:myPathParam/mypage)
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
}

/**
 * Singleton implementation of the misc utilities controller
 */
export const miscUtilsController = new MiscUtilsController();

/**
 * Some utilities for enums
 */
class EnumUtils {

	/**
	 * Gets an array of string values for an enum (valid for NUMERIC enums only)
	 * @param theEnum the enum
	 * @returns the array of string names
	 */
	public getEnumStringValues<T>(theEnum: T): string[] {

		const result = [];

		for(const enumKey in theEnum) {

			if(isNaN(Number(enumKey))) {
		
				result.push(enumKey);
			}
		}

		return result;
	}

	/**
	 * Gets an array of enum values for an enum (valid for NUMERIC enums only)
	 * @param theEnum the enum
	 * @returns the array of enum values
	 */
	public getEnumValues<T>(theEnum: T): T[keyof T][] {

		const result = [];

		for(const enumStringKey in theEnum) {

			if(isNaN(Number(enumStringKey))) {
		
				const enumKeyOf = enumStringKey as keyof typeof theEnum;
				result.push(theEnum[enumKeyOf]);
			}
		}

		return result;
	}
}

/**
 * Singleton implementation of enum utils
 */
export const enumUtils = new EnumUtils();

/**
 * Helper type for URL path params
 */
export type PathParams = {
	[key: string]: string;
};

/**
 * Helper type to define a type starting from an array of options
 */
export type ValuesOf<T extends unknown[]>= T[number];

/**
 * Some utilities for dates
 */
class DateUtils {

	/**
	 * Formats a possibly partial date-string from single numeric values, e.g. (2019, 04, 23) -> 2019-04-23; (2019, 04) -> 2019-04
	 * @param year the year
	 * @param month the optional month (1-12)
	 * @param day the optional day
	 */
	public dateStringFromYearMonthDay(year: number, month?: number, day?: number): string {

		let stringDate = String(year);
		if(month) {

			stringDate += `-${month}`;

			if(day) {

				stringDate += `-${day}`;
			}
		}

		const date: Date = new Date(stringDate);
		return date.toISOString();
	}
}

/**
 * Singleton implementation of date utils
 */
export const dateUtils = new DateUtils();

/**
 * Some utilities for strings
 */
class StringUtils {

	/**
	 * Similar to the default array join but with truthy check (undefined elements will be skipped) and, optionally, sub-properties
	 * @param array the possibly undefined source array
	 * @param separator the separator
	 * @param defaultIfEmpty the default value to return if the join produces an empty result
	 * @param properties optional object properties to evaluate: e.g. if ['name', 'description'] the method will append array[i].name if defined,
	 *                   array[i].description if defined otherwise, or will skip the element if none is defined
	 * @returns the joined string or defaultIfEmpty if nothing to join
	 * @template T the array values
	 * @template R the value to return if nothing to join
	 */
	public join<T, R>(array: T[] | undefined, separator: string, defaultIfEmpty: R, properties?: (keyof T)[]): string | R {

		// First check if we have an array at all
		if(array) {

			let result = '';
			for(const value of array) {

				// Then check if the single element of the array is defined
				if(value) {

					// Get the string to append (the whole value if no properties, the first defined property otherwise)
					let toAppend: string | undefined;
					if(!properties || properties.length === 0) {

						toAppend = String(value);
					}
					else {

						for(const property of properties) {

							if(value[property]) {

								toAppend = String(value[property]);
								break;
							}
						}
					}

					// If we actually have something to append, do it
					if(toAppend) {

						result += toAppend + separator;
					}
				}
			}

			// Final append result
			return result.length > 0 ? result.slice(0, -separator.length) : defaultIfEmpty;
		}
		else {

			return defaultIfEmpty;
		}
	}
}

/**
 * Singleton implementation of string utils
 */
export const stringUtils = new StringUtils();
