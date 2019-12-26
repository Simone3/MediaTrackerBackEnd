import { OldAppBoolean } from 'app/data/models/api/import/old-app/common';

/**
 * Helper to parse a boolean in the old Media Tracker app export
 * @param source the source
 * @returns the target
 */
export const parseOldAppBoolean = (source: OldAppBoolean | undefined): boolean => {

	return source === '1';
};

/**
 * Helper to parse a date in the old Media Tracker app export
 * @param source the source
 * @returns the target
 */
export const parseOldAppDate = (source: string): Date => {

	return new Date(Number(source));
};

/**
 * Helper to parse a multi-value string in the old Media Tracker app export
 * @param source the source
 * @returns the target
 */
export const parseOldAppMultiValueString = (source: string): string[] => {

	return source.split(', ');
};
