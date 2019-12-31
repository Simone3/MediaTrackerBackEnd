/**
 * Helper type for URL path params
 */
export type PathParams = {
	[key: string]: string;
};

/**
 * Helper type to define a type starting from an array of options
 */
export type ValuesOf<T extends unknown[]> = T[number];

/**
 * Helper type to define a class type (constructor)
 */
export declare type ClassType<T> = {
	new (...args: unknown[]): T;
};

