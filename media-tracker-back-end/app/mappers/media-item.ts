import { MediaItemInternal, MediaItemFilterInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal } from '../models/internal/media-item';
import { IdentifiedMediaItem, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResult, CatalogMediaItem } from '../models/api/media-item';
import { AppError } from '../models/error/error';

/**
 * Helper class to translate between internal and public media item models
 */
class MediaItemMapper {
	
	/**
	 * List of internal models to list of public models
	 */
	public toApiMediaItemList(sources: MediaItemInternal[]): IdentifiedMediaItem[] {

		return sources.map((source) => {

			return this.toApiMediaItem(source);
		});
	}

	/**
	 * Internal model to public model
	 */
	public toApiMediaItem(source: MediaItemInternal): IdentifiedMediaItem {
		
		return {
			uid: source._id,
			name: source.name,
			author: source.author,
			importance: source.importance
		};
	}

	/**
	 * List of public models to list of internal models
	 */
	public toInternalMediaItemList<T extends (IdentifiedMediaItem | MediaItem)>(sources: T[], userId: string, categoryId: string): MediaItemInternal[] {

		return sources.map((source) => {

			return this.toInternalMediaItem(source, userId, categoryId);
		});
	}

	/**
	 * Public model to internal model
	 */
	public toInternalMediaItem<T extends (IdentifiedMediaItem | MediaItem)>(source: T, userId: string, categoryId: string): MediaItemInternal {

		const isNew = (source instanceof MediaItem);
		const id = (isNew ? null : (<IdentifiedMediaItem>source).uid);

		return {
			_id: id,
			name: source.name,
			author: source.author,
			category: categoryId,
			owner: userId,
			importance: source.importance
		};
	}

	/**
	 * Internal model to public model
	 */
	public toApiFilter(source: MediaItemFilterInternal): MediaItemFilter {

		return {
			importance: source.importance
		};
	}

	/**
	 * Public model to internal model
	 */
	public toInternalFilter(source: MediaItemFilter): MediaItemFilterInternal {

		return {
			importance: source.importance
		};
	}

	/**
	 * Internal model to public model
	 */
	public toApiSortList(sources: MediaItemSortByInternal[]): MediaItemSortBy[] {

		return sources.map((source) => {

			return this.toApiSort(source);
		});
	}

	/**
	 * Public model to internal model
	 */
	public toInternalSortList(sources: MediaItemSortBy[]): MediaItemSortByInternal[] {
		
		return sources.map((source) => {

			return this.toInternalSort(source);
		});
	}

	/**
	 * Internal model to public model
	 */
	public toApiSort(source: MediaItemSortByInternal): MediaItemSortBy {

		return {
			ascending: source.ascending,
			field: this.toApiSortField(source.field)
		};
	}

	/**
	 * Public model to internal model
	 */
	public toInternalSort(source: MediaItemSortBy): MediaItemSortByInternal {
		
		return {
			ascending: source.ascending,
			field: this.toInternalSortField(source.field)
		};
	}

	/**
	 * Internal model to public model
	 */
	public toApiSortField(source: MediaItemSortFieldInternal): MediaItemSortField {

		switch(source) {

			case MediaItemSortFieldInternal.AUTHOR: return MediaItemSortField.AUTHOR;
			case MediaItemSortFieldInternal.IMPORTANCE: return MediaItemSortField.IMPORTANCE;
			case MediaItemSortFieldInternal.NAME: return MediaItemSortField.NAME;
			default: throw AppError.GENERIC.withDetails('Cannot map ' + source);
		}
	}

	/**
	 * Public model to internal model
	 */
	public toInternalSortField(source: MediaItemSortField): MediaItemSortFieldInternal {

		switch(source) {

			case MediaItemSortField.AUTHOR: return MediaItemSortFieldInternal.AUTHOR;
			case MediaItemSortField.IMPORTANCE: return MediaItemSortFieldInternal.IMPORTANCE;
			case MediaItemSortField.NAME: return MediaItemSortFieldInternal.NAME;
			default: throw AppError.GENERIC.withDetails('Cannot map ' + source);
		}
	}

	/**
	 * List of internal models to list of public models
	 */
	public toApiCatalogSearchResultList(sources: SearchMediaItemCatalogResult[]): SearchMediaItemCatalogResultInternal[] {

		return sources.map((source) => {

			return this.toApiCatalogSearchResult(source);
		});
	}
	
	/**
	 * Internal model to public model
	 */
	public toApiCatalogSearchResult(source: SearchMediaItemCatalogResult): SearchMediaItemCatalogResultInternal {

		return {
			catalogId: source.catalogId,
			title: source.title,
			releaseDate: source.releaseDate,
		}
	}

	/**
	 * Internal model to public model
	 */
	public toApiCatalogDetails(source: CatalogMediaItemInternal): CatalogMediaItem {
		
		return {
			name: source.name,
			author: source.author
		}
	}

}

/**
 * Singleton instance of the media items mapper
 */
export const mediaItemMapper = new MediaItemMapper();


