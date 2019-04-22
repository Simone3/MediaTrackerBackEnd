import { SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal } from "../../../models/internal/media-items/media-item";

/**
 * Abstract controller for a generic media item catalog
 * @template S the media item catalog search result
 * @template C the media item catalog details
 */
export abstract class MediaItemCatalogController<S extends SearchMediaItemCatalogResultInternal, C extends CatalogMediaItemInternal> {

	/**
	 * Searches the media item catalog by term
	 * @param searchTerm the search term
	 * @returns the list of catalog results, as a promise
	 */
	public abstract searchMediaItemCatalogByTerm(searchTerm: string): Promise<S[]>;

	/**
	 * Loads the catalog details for a specific media item
	 * @param catalogItemId the catalog-specific media item ID
	 * @returns the catalog details, as a promise
	 */
	public abstract getMediaItemFromCatalog(catalogItemId: string): Promise<C>;
}

