import { IsNotEmpty, IsOptional, IsString, ValidateNested, IsDefined, IsEnum, IsBoolean, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CommonRequest, CommonResponse, CommonSaveRequest } from './common';

/**
 * Model for a media item with base properties, publicly exposed via API
 */
export class CatalogMediaItem {

	/**
	 * The media item name
	 */
	@IsNotEmpty()
	@IsString()
	name!: string;

	/**
	 * The media item author
	 */
	@IsOptional()
	@IsString()
	author?: string;
}

/**
 * Model for a media item with all properties except ID, publicly exposed via API
 */
export class MediaItem extends CatalogMediaItem {

	/**
	 * The media item importance level
	 */
	@IsNotEmpty()
	@IsInt()
	importance!: number;

	/**
	 * The media item group
	 */
	@IsOptional()
	@Type(() => MediaItemGroup)
	@ValidateNested()
	group?: MediaItemGroup;
};

/**
 * Model for a media item with all properties including ID, publicly exposed via API
 */
export class IdentifiedMediaItem extends MediaItem {

	/**
	 * The media item unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};

/**
 * Model for a media item group info, publicly exposed via API
 */
export class MediaItemGroup {

	/**
	 * The group ID
	 */
	@IsNotEmpty()
	@IsString()
	groupId!: string;

	/**
	 * The group name
	 */
	@IsOptional()
	@IsString()
	groupName?: string;

	/**
	 * The media item order inside the group
	 */
	@IsNotEmpty()
	@IsInt()
	orderInGroup!: number;
}

/**
 * Request for the "add media item" API
 */
export class AddMediaItemRequest extends CommonSaveRequest {

	/**
	 * The media item to add
	 */
	@IsDefined()
	@Type(() => MediaItem)
	@ValidateNested()
	newMediaItem!: MediaItem;
};

/**
 * Response for the "add media item" API
 */
export class AddMediaItemResponse extends CommonResponse {

}

/**
 * Response for the "delete media item" API
 */
export class DeleteMediaItemResponse extends CommonResponse {

}

/**
 * Response for the "get all media items" API
 */
export class GetAllMediaItemsResponse extends CommonResponse {

	/**
	 * The retrieved media items
	 */
	mediaItems: IdentifiedMediaItem[] = [];
};

/**
 * Request for the "update media item" API
 */
export class UpdateMediaItemRequest extends CommonSaveRequest {

	/**
	 * The media item to update
	 */
	@IsDefined()
	@Type(() => MediaItem)
	@ValidateNested()
	mediaItem!: MediaItem;
};

/**
 * Response for the "update media item" API
 */
export class UpdateMediaItemResponse extends CommonResponse {

}

/**
 * Request for the "filter media items" API
 */
export class FilterMediaItemsRequest extends CommonRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => MediaItemFilter)
	@ValidateNested()
	filter?: MediaItemFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => MediaItemSortBy)
	@ValidateNested()
	sortBy?: MediaItemSortBy[];
};

/**
 * Response for the "filter media items" API
 */
export class FilterMediaItemsResponse extends CommonResponse {

	/**
	 * The retrieved media items
	 */
	mediaItems: IdentifiedMediaItem[] = [];
}

/**
 * Request for the "search media items" API
 */
export class SearchMediaItemsRequest extends CommonRequest {

	/**
	 * Currently active filtering options
	 */
	@IsOptional()
	@Type(() => MediaItemFilter)
	@ValidateNested()
	filter?: MediaItemFilter;

	/**
	 * The search term
	 */
	@IsNotEmpty()
	@IsString()
	searchTerm!: string;
};

/**
 * Response for the "search media items" API
 */
export class SearchMediaItemsResponse extends CommonResponse {

	/**
	 * The retrieved media items
	 */
	mediaItems: IdentifiedMediaItem[] = [];
};

/**
 * Media items filtering options
 */
export class MediaItemFilter {

	/**
	 * Importance level to filter
	 */
	@IsOptional()
	@IsInt()
	importance?: number;

	/**
	 * Group to filter
	 */
	@IsOptional()
	@IsString()
	groupId?: string;
}

/**
 * Values for ordering options
 */
export enum MediaItemSortField {

	IMPORTANCE,
	AUTHOR,
	NAME,
	GROUP
}

/**
 * Helper for enum transformation
 */
function mediaItemSortFieldTypeToString(field: MediaItemSortField): string {
    return MediaItemSortField[field];
}

/**
 * Media items sort by options
 */
export class MediaItemSortBy {

	/**
	 * The sort by field
	 */
	@IsDefined()
	@IsEnum(MediaItemSortField)
	@Transform(mediaItemSortFieldTypeToString)
	field!: MediaItemSortField;

	/**
	 * True if ASC, false if DESC
	 */
	@IsDefined()
	@IsBoolean()
	ascending!: boolean;
}

/**
 * Response for the "search catalog" API
 */
export class SearchMediaItemCatalogResponse extends CommonResponse {

	/**
	 * The search results
	 */
	searchResults: SearchMediaItemCatalogResult[] = [];
};

/**
 * Media item catalog search result
 */
export class SearchMediaItemCatalogResult {

	catalogId: number = 0;
    title: string = "";
	releaseDate?: string;
}

/**
 * Response for the "get from catalog" API
 */
export class GetMediaItemFromCatalogResponse extends CommonResponse {

	/**
	 * The media item details
	 */
	catalogDetails: CatalogMediaItem = new CatalogMediaItem;
};















