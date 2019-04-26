
/**
 * Helper to generate a random name
 */
export const randomName = (prefix?: string): string => {

	prefix = prefix ? `${prefix}-` : '';
	return `${prefix}MyTest-${Math.floor(Math.random() * 100000)}`;
};

/**
 * Helper to return the "_id" property as a string from an object
 */
export const extractId = (valueWithId: { _id: unknown }): string => {

	return String(valueWithId._id);
};

/**
 * Helper to return the "name" property as a string from an object
 */
export const extractName = (valueWithName: { name: string }): string => {

	return String(valueWithName.name);
};
