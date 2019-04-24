import { ValuesOf } from "app/controllers/utilities/misc-utils";
import { PersistedEntityInternal } from "app/models/internal/common";
import { UserInternal } from "app/models/internal/user";

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
