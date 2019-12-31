import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * Util type to extract common fields to both videogame entities and catalog entries
 */
type CoreVideogameDataInternal = {

	developers?: string[];
	publishers?: string[];
	platforms?: string[];
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type VideogameInternal = MediaItemInternal & CoreVideogameDataInternal & {

	averageLengthHours?: number;
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
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogVideogameInternal = CatalogMediaItemInternal & CoreVideogameDataInternal & {

};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchVideogameCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

