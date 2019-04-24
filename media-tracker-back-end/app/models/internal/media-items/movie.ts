import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';

/**
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogMovieInternal = CatalogMediaItemInternal & {

	director?: string;
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type MovieInternal = MediaItemInternal & {

	director?: string;
};

/**
 * Model for a media item filtering options, internal type NOT to be exposed via API
 */
export type MovieFilterInternal = MediaItemFilterInternal & {
	
};

/**
 * Values for ordering options, internal type NOT to be exposed via API
 */
export type MovieSortFieldInternal = MediaItemSortFieldInternal | 'DIRECTOR';

/**
 * Media items sort by options, internal type NOT to be exposed via API
 */
export type MovieSortByInternal = MediaItemSortByInternal & {

	field: MovieSortFieldInternal;
};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchMovieCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

