import { CatalogMediaItemInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';

/**
 * Abstract controller for a generic media item catalog
 * @template TSearchMediaItemCatalogResultInternal the media item catalog search result
 * @template TCatalogMediaItemInternal the media item catalog details
 */
export abstract class MediaItemCatalogController<TSearchMediaItemCatalogResultInternal extends SearchMediaItemCatalogResultInternal, TCatalogMediaItemInternal extends CatalogMediaItemInternal> {

	/**
	 * Searches the media item catalog by term
	 * @param searchTerm the search term
	 * @returns the list of catalog results, as a promise
	 */
	public abstract searchMediaItemCatalogByTerm(searchTerm: string): Promise<TSearchMediaItemCatalogResultInternal[]>;

	/**
	 * Loads the catalog details for a specific media item
	 * @param catalogItemId the catalog-specific media item ID
	 * @returns the catalog details, as a promise
	 */
	public abstract getMediaItemFromCatalog(catalogItemId: string): Promise<TCatalogMediaItemInternal>;
}

