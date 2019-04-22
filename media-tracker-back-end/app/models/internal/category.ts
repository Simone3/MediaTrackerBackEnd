import { UserInternal } from "./user";
import { PersistedEntityInternal } from "./common";

/**
 * A category media type, internal type NOT to be exposed via API
 */
export enum MediaTypeInternal {

	BOOK,
	MOVIE,
	TV_SHOW,
	VIDEOGAME
}

/**
 * Model for a category, internal type NOT to be exposed via API
 */
export type CategoryInternal = PersistedEntityInternal & {

	name: string;
	mediaType: MediaTypeInternal;
	owner: UserInternal | string;
}