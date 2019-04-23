import { UserInternal } from "./user";
import { PersistedEntityInternal } from "./common";
import { ValuesOf } from "../../controllers/utilities/misc-utils";

/**
 * Array of all media types, internal type NOT to be exposed via API
 */
export const INTERNAL_MEDIA_TYPES: ['BOOK', 'MOVIE', 'TV_SHOW', 'VIDEOGAME'] = ['BOOK', 'MOVIE', 'TV_SHOW', 'VIDEOGAME'];

/**
 * A category media type, internal type NOT to be exposed via API
 */
export type MediaTypeInternal = ValuesOf<typeof INTERNAL_MEDIA_TYPES>;

/**
 * Model for a category, internal type NOT to be exposed via API
 */
export type CategoryInternal = PersistedEntityInternal & {

	name: string;
	mediaType: MediaTypeInternal;
	owner: UserInternal | string;
}
