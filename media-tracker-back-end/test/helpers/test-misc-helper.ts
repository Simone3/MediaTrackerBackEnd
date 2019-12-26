import chai from 'chai';

const expect = chai.expect;

/**
 * Helper to generate a random name
 * @param prefix the optional prefix of the random string
 * @returns the random string
 */
export const randomName = (prefix?: string): string => {

	prefix = prefix ? `${prefix}-` : '';
	return `${prefix}MyTest-${Math.floor(Math.random() * 10000000)}`;
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

/**
 * Helper to compare only the given fields of the "value" and "expected" objects
 * @param value the test result object
 * @param expected the expected result object
 * @param fields the fields to compare in the two objects
 * @param message the error
 */
export const comparePickedFields = function<V extends E, E extends object>(value: V, expected: E, fields: (keyof E)[], message: string): void {

	for(const field of fields) {

		expect(value[field], `${message} [comparing field '${field}']`).to.be.eql(expected[field]);
	}
};

/**
 * Helper to compare the "value" and "expected" objects considering only the "expected" fields.
 * E.g. with value = {a:1, b:2, c:3} and expected = {a:1, c:3} the comparison succeeds because only "a" and "c" fields are compared between the two.
 * @param value the test result object
 * @param expected the expected result object
 * @param message the error
 */
export const compareExpectedFields = function<V extends E, E extends object>(value: V, expected: E, message: string): void {

	comparePickedFields(value, expected, Object.keys(expected) as (keyof E)[], message);
};
