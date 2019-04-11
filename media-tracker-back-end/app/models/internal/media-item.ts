import { CategoryInternal } from "./category";
import { UserInternal } from "./user";
import { PersistedEntityInternal } from "./common";
import { GroupInternal } from "./group";

/**
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogMediaItemInternal = {

	name: string;
	author?: string;
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type MediaItemInternal = CatalogMediaItemInternal & PersistedEntityInternal & {

	category: CategoryInternal | string;
	group?: GroupInternal | string;
	orderInGroup?: number;
	owner: UserInternal | string;
	importance: number;
};

/**
 * Model for a media item filtering options, internal type NOT to be exposed via API
 */
export type MediaItemFilterInternal = {
	
	importance?: number;
	groupId?: string;
};

/**
 * Values for ordering options, internal type NOT to be exposed via API
 */
export enum MediaItemSortFieldInternal {

	IMPORTANCE,
	AUTHOR,
	NAME,
	GROUP
}

/**
 * Media items sort by options, internal type NOT to be exposed via API
 */
export type MediaItemSortByInternal = {

	field: MediaItemSortFieldInternal;
	ascending: boolean;
}

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchMediaItemCatalogResultInternal = {

	catalogId: number,
    title: string,
	releaseDate?: string
}

