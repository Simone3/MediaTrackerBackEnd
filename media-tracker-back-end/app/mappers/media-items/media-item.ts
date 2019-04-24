import { ModelMapper } from 'app/mappers/common';
import { CatalogMediaItem, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResult } from 'app/models/api/media-items/media-item';
import { AppError } from 'app/models/error/error';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';

/**
 * Helper type
 */
export type MediaItemMapperParams = {
	userId: string,
	categoryId: string
};

/**
 * Abstract mapper for media items
 */
export abstract class MediaItemMapper<TMediaItemInternal extends MediaItemInternal, TMediaItem extends MediaItem> extends ModelMapper<TMediaItemInternal, TMediaItem, MediaItemMapperParams> {
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToExternal(source: MediaItemInternal): MediaItem {
		
		const target: MediaItem = {
			name: source.name,
			importance: source.importance
		};

		if(source.group && source.orderInGroup && typeof(source.group) !== 'string') {

			target.group = {
				groupId: String(source.group._id),
				groupName: source.group.name,
				orderInGroup: source.orderInGroup
			};
		}

		return target;
	}
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToInternal(source: MediaItem, extraParams?: MediaItemMapperParams): MediaItemInternal {

		if(!extraParams) {
			throw "convertToInternal.extraParams cannot be undefined"
		}

		return {
			_id: null,
			name: source.name,
			category: extraParams.categoryId,
			owner: extraParams.userId,
			group: (source.group ? source.group.groupId : undefined),
			orderInGroup: (source.group ? source.group.orderInGroup : undefined),
			importance: source.importance
		};
	}
}

/**
 * Abstract mapper for media item filters
 */
export abstract class MediaItemFilterMapper<TMediaItemFilterInternal extends MediaItemFilterInternal, TMediaItemFilter extends MediaItemFilter> extends ModelMapper<TMediaItemFilterInternal, TMediaItemFilter, never> {
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToExternal(source: MediaItemFilterInternal): MediaItemFilter {

		return {
			importance: source.importance,
			groupId: source.groupId
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToInternal(source: MediaItemFilter): MediaItemFilterInternal {

		return {
			importance: source.importance,
			groupId: source.groupId
		};
	}
}

/**
 * Abstract mapper for media item sort options
 */
export abstract class MediaItemSortMapper<TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemSortBy extends MediaItemSortBy> extends ModelMapper<TMediaItemSortByInternal, TMediaItemSortBy, never> {
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToExternal(source: MediaItemSortByInternal): MediaItemSortBy {

		return {
			ascending: source.ascending
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToInternal(source: MediaItemSortBy): MediaItemSortByInternal {
		
		return {
			ascending: source.ascending
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToExternalField(source: MediaItemSortFieldInternal): string {

		switch(source) {

			case 'IMPORTANCE': return MediaItemSortField.IMPORTANCE;
			case 'NAME': return MediaItemSortField.NAME;
			case 'GROUP': return MediaItemSortField.GROUP;
			default: throw AppError.GENERIC.withDetails('Cannot map ' + source);
		}
	}
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToInternalField(source: MediaItemSortField): MediaItemSortFieldInternal {

		switch(source) {

			case MediaItemSortField.IMPORTANCE: return 'IMPORTANCE';
			case MediaItemSortField.NAME: return 'NAME';
			case MediaItemSortField.GROUP: return 'GROUP';
			default: throw AppError.GENERIC.withDetails('Cannot map ' + source);
		}
	}
}

/**
 * Abstract mapper for media item catalog search results
 */
export abstract class MediaItemCatalogSearchMapper<TSearchMediaItemCatalogResultInternal extends SearchMediaItemCatalogResultInternal, TSearchMediaItemCatalogResult extends SearchMediaItemCatalogResult> extends ModelMapper<TSearchMediaItemCatalogResultInternal, TSearchMediaItemCatalogResult, never> {
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToExternal(source: SearchMediaItemCatalogResultInternal): SearchMediaItemCatalogResult {

		return {
			catalogId: source.catalogId,
			title: source.title,
			releaseDate: source.releaseDate
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToInternal(source: SearchMediaItemCatalogResult): SearchMediaItemCatalogResultInternal {
		
		return {
			catalogId: source.catalogId,
			title: source.title,
			releaseDate: source.releaseDate
		};
	}
}

/**
 * Abstract mapper for media item catalog details
 */
export abstract class MediaItemCatalogDetailsMapper<TCatalogMediaItemInternal extends CatalogMediaItemInternal, TCatalogMediaItem extends CatalogMediaItem> extends ModelMapper<TCatalogMediaItemInternal, TCatalogMediaItem, never> {
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToExternal(source: CatalogMediaItemInternal): CatalogMediaItem {

		return {
			name: source.name
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 */
	protected commonToInternal(source: CatalogMediaItem): CatalogMediaItemInternal {
		
		return {
			name: source.name
		};
	}
}



