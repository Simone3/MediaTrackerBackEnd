import { ValuesOf } from 'app/utilities/helper-types';

/**
 * Array of all boolean values in the old Media Tracker app export, publicly exposed via API
 */
export const OLD_APP_BOOLEAN: [ '0', '1' ] = [ '0', '1' ];

/**
 * A boolean value in the old Media Tracker app export, publicly exposed via API
 */
export type OldAppBoolean = ValuesOf<typeof OLD_APP_BOOLEAN>;
