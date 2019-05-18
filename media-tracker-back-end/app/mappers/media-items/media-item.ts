import { ModelMapper } from 'app/mappers/common';
import { CatalogMediaItem, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResult } from 'app/models/api/media-items/media-item';
import { AppError } from 'app/models/error/error';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';
import { dateUtils } from 'app/utilities/date-utils';
import { miscUtils } from 'app/utilities/misc-utils';
import { groupMapper } from '../group';
import { ownPlatformMapper } from '../own-platform';

/**
 * Helper type
 */
export type MediaItemMapperParams = {
	userId: string;
	categoryId: string;
};

/**
 * Abstract mapper for media items
 * @template TMediaItemInternal the class of the internal media item entity
 * @template TMediaItem the class of the API media item entity
 */
export abstract class MediaItemMapper<TMediaItemInternal extends MediaItemInternal, TMediaItem extends MediaItem> extends ModelMapper<TMediaItemInternal, TMediaItem, MediaItemMapperParams> {
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: MediaItemInternal): MediaItem {
		
		const target: MediaItem = {
			name: source.name,
			importance: source.importance,
			genres: source.genres,
			description: source.description,
			userComment: source.userComment,
			completedAt: dateUtils.toStringList(source.completedAt),
			releaseDate: dateUtils.toString(source.releaseDate),
			active: miscUtils.parseBoolean(source.active),
			catalogId: source.catalogId,
			imageUrl: source.imageUrl
		};

		if(source.group && source.orderInGroup && typeof source.group !== 'string') {

			target.group = {
				groupId: String(source.group._id),
				groupData: groupMapper.toExternal(source.group),
				orderInGroup: source.orderInGroup
			};
		}

		if(source.ownPlatform && typeof source.ownPlatform !== 'string') {

			target.ownPlatform = {
				ownPlatformId: String(source.ownPlatform._id),
				ownPlatformData: ownPlatformMapper.toExternal(source.ownPlatform)
			};
		}

		return target;
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @param extraParams the required extra params
	 * @returns the mapping target
	 */
	protected commonToInternal(source: MediaItem, extraParams?: MediaItemMapperParams): MediaItemInternal {

		if(!extraParams) {
			throw AppError.GENERIC.withDetails('convertToInternal.extraParams cannot be undefined');
		}

		return {
			_id: null,
			name: source.name,
			category: extraParams.categoryId,
			owner: extraParams.userId,
			group: source.group ? source.group.groupId : undefined,
			ownPlatform: source.ownPlatform ? source.ownPlatform.ownPlatformId : undefined,
			orderInGroup: source.group ? source.group.orderInGroup : undefined,
			importance: source.importance,
			genres: source.genres,
			description: source.description,
			userComment: source.userComment,
			completedAt: dateUtils.toDateList(source.completedAt),
			releaseDate: dateUtils.toDate(source.releaseDate),
			active: miscUtils.parseBoolean(source.active),
			catalogId: source.catalogId,
			imageUrl: source.imageUrl
		};
	}
}

/**
 * Abstract mapper for media item filters
 * @template TMediaItemFilterInternal the class of the internal media item entity
 * @template TMediaItemFilter the class of the API media item entity
 */
export abstract class MediaItemFilterMapper<TMediaItemFilterInternal extends MediaItemFilterInternal, TMediaItemFilter extends MediaItemFilter> extends ModelMapper<TMediaItemFilterInternal, TMediaItemFilter, never> {
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: MediaItemFilterInternal): MediaItemFilter {

		return {
			importance: source.importance,
			groupId: source.groupId,
			ownPlatformId: source.ownPlatformId
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: MediaItemFilter): MediaItemFilterInternal {

		return {
			importance: source.importance,
			groupId: source.groupId,
			ownPlatformId: source.ownPlatformId
		};
	}
}

/**
 * Abstract mapper for media item sort options
 * @template TMediaItemSortByInternal the class of the internal media item entity
 * @template TMediaItemSortBy the class of the API media item entity
 */
export abstract class MediaItemSortMapper<TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemSortBy extends MediaItemSortBy> extends ModelMapper<TMediaItemSortByInternal, TMediaItemSortBy, never> {
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: MediaItemSortByInternal): MediaItemSortBy {

		return {
			ascending: source.ascending
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: MediaItemSortBy): MediaItemSortByInternal {
		
		return {
			ascending: source.ascending
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternalField(source: MediaItemSortFieldInternal): string {

		switch(source) {

			case 'IMPORTANCE': return MediaItemSortField.IMPORTANCE;
			case 'NAME': return MediaItemSortField.NAME;
			case 'GROUP': return MediaItemSortField.GROUP;
			case 'OWN_PLATFORM': return MediaItemSortField.OWN_PLATFORM;
			default: throw AppError.GENERIC.withDetails(`Cannot map ${source}`);
		}
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternalField(source: MediaItemSortField): MediaItemSortFieldInternal {

		switch(source) {

			case MediaItemSortField.IMPORTANCE: return 'IMPORTANCE';
			case MediaItemSortField.NAME: return 'NAME';
			case MediaItemSortField.GROUP: return 'GROUP';
			case MediaItemSortField.OWN_PLATFORM: return 'OWN_PLATFORM';
			default: throw AppError.GENERIC.withDetails(`Cannot map ${source}`);
		}
	}
}

/**
 * Abstract mapper for media item catalog search results
 * @template TSearchMediaItemCatalogResultInternal the class of the internal media item entity
 * @template TSearchMediaItemCatalogResult the class of the API media item entity
 */
export abstract class MediaItemCatalogSearchMapper<TSearchMediaItemCatalogResultInternal extends SearchMediaItemCatalogResultInternal, TSearchMediaItemCatalogResult extends SearchMediaItemCatalogResult> extends ModelMapper<TSearchMediaItemCatalogResultInternal, TSearchMediaItemCatalogResult, never> {
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: SearchMediaItemCatalogResultInternal): SearchMediaItemCatalogResult {

		return {
			catalogId: source.catalogId,
			name: source.name,
			releaseDate: dateUtils.toString(source.releaseDate)
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: SearchMediaItemCatalogResult): SearchMediaItemCatalogResultInternal {
		
		return {
			catalogId: source.catalogId,
			name: source.name,
			releaseDate: dateUtils.toDate(source.releaseDate)
		};
	}
}

/**
 * Abstract mapper for media item catalog details
 * @template TCatalogMediaItemInternal the class of the internal media item entity
 * @template TCatalogMediaItem the class of the API media item entity
 */
export abstract class MediaItemCatalogDetailsMapper<TCatalogMediaItemInternal extends CatalogMediaItemInternal, TCatalogMediaItem extends CatalogMediaItem> extends ModelMapper<TCatalogMediaItemInternal, TCatalogMediaItem, never> {
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: CatalogMediaItemInternal): CatalogMediaItem {

		return {
			name: source.name,
			genres: source.genres,
			description: source.description,
			releaseDate: dateUtils.toString(source.releaseDate),
			imageUrl: source.imageUrl
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: CatalogMediaItem): CatalogMediaItemInternal {
		
		return {
			name: source.name,
			genres: source.genres,
			description: source.description,
			releaseDate: dateUtils.toDate(source.releaseDate),
			imageUrl: source.imageUrl
		};
	}
}

