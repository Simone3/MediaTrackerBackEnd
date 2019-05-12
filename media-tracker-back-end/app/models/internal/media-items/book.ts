import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';

/**
 * Util type to extract common fields to both book entities and catalog entries
 */
type CoreBookDataInternal = {

	authors?: string[];
	pagesNumber?: number;
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type BookInternal = MediaItemInternal & CoreBookDataInternal & {

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
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogBookInternal = CatalogMediaItemInternal & CoreBookDataInternal & {

};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchBookCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

