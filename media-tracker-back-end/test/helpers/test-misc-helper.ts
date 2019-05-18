
/**
 * Helper to generate a random name
 * @param prefix the optional prefix of the random string
 * @returns the random string
 */
export const randomName = (prefix?: string): string => {

	prefix = prefix ? `${prefix}-` : '';
	return `${prefix}MyTest-${Math.floor(Math.random() * 100000)}`;
};

/**
 * Helper to extract the "field" field in each object in the array
 * @param array the source array
 * @param field the field to extract from each element
 * @returns the array of extracted elements
 */
export const extract = function<V extends object>(array: V[], field: keyof V): V[keyof V][] {

	return array.map((value) => {

		return value[field];
	});
};

/**
 * Helper to extract the "field" field in each object in the array, casting it to string
 * @param array the source array
 * @param field the field to extract from each element
 * @returns the array of extracted elements, as strings
 */
export const extractAsString = function<V extends object>(array: V[], field: keyof V): string[] {

	return array.map((value) => {

		return String(value[field]);
	});
};
