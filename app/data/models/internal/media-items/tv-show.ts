import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * Util type to extract common fields to both TV show entities and catalog entries
 */
type CoreTvShowDataInternal = {

	creators?: string[];
	averageEpisodeRuntimeMinutes?: number;
	inProduction?: boolean;
	nextEpisodeAirDate?: Date;
};

/**
 * Model for a TV Show season, internal type just for display purposes
 */
export type TvShowSeasonInternal = {

	number: number;
	episodesNumber?: number;
	watchedEpisodesNumber?: number;
}

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type TvShowInternal = MediaItemInternal & CoreTvShowDataInternal & {

	seasons?: TvShowSeasonInternal[];
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
 * Model for a catalog TV Show season, internal type just for display purposes
 */
export type CatalogTvShowSeasonInternal = {

	number: number;
	episodesNumber?: number;
}

/**
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogTvShowInternal = CatalogMediaItemInternal & CoreTvShowDataInternal & {
	
	seasons?: CatalogTvShowSeasonInternal[];
};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchTvShowCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

