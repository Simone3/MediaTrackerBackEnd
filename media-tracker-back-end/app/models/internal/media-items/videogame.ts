import { CatalogMediaItemInternal, MediaItemInternal, MediaItemFilterInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal, MediaItemSortFieldInternal } from "./media-item";

/**
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogVideogameInternal = CatalogMediaItemInternal & {

	developer?: string;
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type VideogameInternal = MediaItemInternal & {

	developer?: string;
};

/**
 * Model for a media item filtering options, internal type NOT to be exposed via API
 */
export type VideogameFilterInternal = MediaItemFilterInternal & {
	
};

/**
 * Values for ordering options, internal type NOT to be exposed via API
 */
export type VideogameSortFieldInternal = MediaItemSortFieldInternal | 'DEVELOPER';

/**
 * Media items sort by options, internal type NOT to be exposed via API
 */
export type VideogameSortByInternal = MediaItemSortByInternal & {

	field: VideogameSortFieldInternal;
};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchVideogameCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

