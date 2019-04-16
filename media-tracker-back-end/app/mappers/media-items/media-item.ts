import { MediaItemInternal, MediaItemFilterInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal } from '../../models/internal/media-items/media-item';
import { MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResult, CatalogMediaItem } from '../../models/api/media-items/media-item';
import { AppError } from '../../models/error/error';
import { ModelMapper } from '../common';

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
export abstract class MediaItemMapper<I extends MediaItemInternal, E extends MediaItem> extends ModelMapper<I, E, MediaItemMapperParams> {
	
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
export abstract class MediaItemFilterMapper<I extends MediaItemFilterInternal, E extends MediaItemFilter> extends ModelMapper<I, E, never> {

	protected commonToExternal(source: MediaItemFilterInternal): MediaItemFilter {

		return {
			importance: source.importance,
			groupId: source.groupId
		};
	}

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
export abstract class MediaItemSortMapper<I extends MediaItemSortByInternal, E extends MediaItemSortBy> extends ModelMapper<I, E, never> {

	protected commonToExternal(source: MediaItemSortByInternal): MediaItemSortBy {

		return {
			ascending: source.ascending
		};
	}

	protected commonToInternal(source: MediaItemSortBy): MediaItemSortByInternal {
		
		return {
			ascending: source.ascending
		};
	}

	protected commonToExternalField(source: MediaItemSortFieldInternal): string {

		switch(source) {

			case 'IMPORTANCE': return MediaItemSortField.IMPORTANCE;
			case 'NAME': return MediaItemSortField.NAME;
			case 'GROUP': return MediaItemSortField.GROUP;
			default: throw AppError.GENERIC.withDetails('Cannot map ' + source);
		}
	}

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
export abstract class MediaItemCatalogSearchMapper<I extends SearchMediaItemCatalogResultInternal, E extends SearchMediaItemCatalogResult> extends ModelMapper<I, E, never> {

	protected commonToExternal(source: SearchMediaItemCatalogResultInternal): SearchMediaItemCatalogResult {

		return {
			catalogId: source.catalogId,
			title: source.title,
			releaseDate: source.releaseDate
		};
	}

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
export abstract class MediaItemCatalogDetailsMapper<I extends CatalogMediaItemInternal, E extends CatalogMediaItem> extends ModelMapper<I, E, never> {

	protected commonToExternal(source: CatalogMediaItemInternal): CatalogMediaItem {

		return {
			name: source.name
		};
	}

	protected commonToInternal(source: CatalogMediaItem): CatalogMediaItemInternal {
		
		return {
			name: source.name
		};
	}
}



