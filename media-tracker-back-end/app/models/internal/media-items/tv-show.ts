import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';

/**
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogTvShowInternal = CatalogMediaItemInternal & {

	creator?: string;
	nextEpisodeAirDate?: string;
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type TvShowInternal = MediaItemInternal & {

	creator?: string;
};

/**
 * Model for a media item filtering options, internal type NOT to be exposed via API
 */
export type TvShowFilterInternal = MediaItemFilterInternal & {
	
};

/**
 * Values for ordering options, internal type NOT to be exposed via API
 */
export type TvShowSortFieldInternal = MediaItemSortFieldInternal | 'CREATOR';

/**
 * Media items sort by options, internal type NOT to be exposed via API
 */
export type TvShowSortByInternal = MediaItemSortByInternal & {

	field: TvShowSortFieldInternal;
};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchTvShowCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

