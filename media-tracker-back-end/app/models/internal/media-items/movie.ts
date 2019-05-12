import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';

/**
 * Util type to extract common fields to both movie entities and catalog entries
 */
type CoreMovieDataInternal = {

	directors?: string[];
	durationMinutes?: number;
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type MovieInternal = MediaItemInternal & CoreMovieDataInternal & {

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
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogMovieInternal = CatalogMediaItemInternal & CoreMovieDataInternal & {

};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchMovieCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

