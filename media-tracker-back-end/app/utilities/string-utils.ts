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
	 *				   array[i].description if defined otherwise, or will skip the element if none is defined
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
