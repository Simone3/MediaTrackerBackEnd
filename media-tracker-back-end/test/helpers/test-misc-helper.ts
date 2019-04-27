
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
export const extractId = (value: { _id: unknown }): string => {

	return String(value._id);
};

/**
 * Helper to return the "name" property as a string from an object
 */
export const extractName = (value: { name: string }): string => {

	return String(value.name);
};

/**
 * Helper to return the "title" property as a string from an object
 */
export const extractTitle = (value: { title: string }): string => {

	return String(value.title);
};

/**
 * Helper to return the "catalogId" property as a string from an object
 */
export const extractCatalogId = (value: { catalogId: unknown }): string => {

	return String(value.catalogId);
};
