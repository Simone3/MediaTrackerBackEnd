import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';

/**
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogBookInternal = CatalogMediaItemInternal & {

	author?: string;
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type BookInternal = MediaItemInternal & {

	author?: string;
};

/**
 * Model for a media item filtering options, internal type NOT to be exposed via API
 */
export type BookFilterInternal = MediaItemFilterInternal & {
	
};

/**
 * Values for ordering options, internal type NOT to be exposed via API
 */
export type BookSortFieldInternal = MediaItemSortFieldInternal | 'AUTHOR';

/**
 * Media items sort by options, internal type NOT to be exposed via API
 */
export type BookSortByInternal = MediaItemSortByInternal & {

	field: BookSortFieldInternal;
};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchBookCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

