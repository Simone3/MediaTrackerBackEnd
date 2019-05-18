import { CommonAddResponse, CommonRequest, CommonResponse, CommonSaveRequest } from 'app/models/api/common';
import { Group } from 'app/models/api/group';
import { OwnPlatform } from 'app/models/api/own-platform';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Util class to extract common fields to both media item entities and catalog entries
 */
class CoreMediaItemData {

	/**
	 * The media item name
	 */
	@IsNotEmpty()
	@IsString()
	public name!: string;

	/**
	 * The list of media item genres
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public genres?: string[];

	/**
	 * The media item description
	 */
	@IsOptional()
	@IsString()
	public description?: string;

	/**
	 * The media item release date
	 */
	@IsOptional()
	@IsDateString()
	public releaseDate?: string;

	/**
	 * The URL to the thumbnail image
	 */
	@IsOptional()
	@IsString()
	public imageUrl?: string;
}

/**
 * Model for a media item group data, publicly exposed via API
 */
export class MediaItemGroup {

	/**
	 * The group ID
	 */
	@IsNotEmpty()
	@IsString()
	public groupId!: string;

	/**
	 * The group full data. Loaded by GET methods but not required by PUT/POST methods
	 */
	@IsOptional()
	@Type(() => {
		return Group;
	})
	@ValidateNested()
	public groupData?: Group;

	/**
	 * The media item order inside the group
	 */
	@IsNotEmpty()
	@IsInt()
	public orderInGroup!: number;
}

/**
 * Model for a media item own platform, publicly exposed via API
 */
export class MediaItemOwnPlatform {

	/**
	 * The own platform ID
	 */
	@IsNotEmpty()
	@IsString()
	public ownPlatformId!: string;

	/**
	 * The own platform full data. Loaded by GET methods but not required by PUT/POST methods
	 */
	@IsOptional()
	@Type(() => {
		return OwnPlatform;
	})
	@ValidateNested()
	public ownPlatformData?: OwnPlatform;
}

/**
 * Abstract model for a media item, publicly exposed via API
 */
export abstract class MediaItem extends CoreMediaItemData {

	/**
	 * The media item importance level
	 */
	@IsNotEmpty()
	@IsInt()
	public importance!: number;

	/**
	 * The media item group
	 */
	@IsOptional()
	@Type(() => {
		return MediaItemGroup;
	})
	@ValidateNested()
	public group?: MediaItemGroup;

	/**
	 * The platform where the user owns the media item
	 */
	@IsOptional()
	@Type(() => {
		return MediaItemOwnPlatform;
	})
	@ValidateNested()
	public ownPlatform?: MediaItemOwnPlatform;

	/**
	 * A user comment about the media item
	 */
	@IsOptional()
	@IsString()
	public userComment?: string;

	/**
	 * Dates on which the user "completed" (e.g. watched) the media item
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsDateString({ each: true })
	public completedAt?: string[];

	/**
	 * If the user marked the media item as currently active (e.g. currently reading)
	 */
	@IsOptional()
	@IsBoolean()
	public active?: boolean;

	/**
	 * The data source catalog reference
	 */
	@IsOptional()
	@IsString()
	public catalogId?: string;
}

/**
 * Abstract media items filtering options, publicly exposed via API
 */
export abstract class MediaItemFilter {

	/**
	 * Importance level to filter
	 */
	@IsOptional()
	@IsInt()
	public importance?: number;

	/**
	 * Group to filter
	 */
	@IsOptional()
	@IsString()
	public groupId?: string;

	/**
	 * Own platform to filter
	 */
	@IsOptional()
	@IsString()
	public ownPlatformId?: string;
}

/**
 * Common values for ordering options, publicly exposed via API
 */
export abstract class MediaItemSortField {

	public static readonly IMPORTANCE: string = 'IMPORTANCE';
	public static readonly NAME: string = 'NAME';
	public static readonly GROUP: string = 'GROUP';
	public static readonly OWN_PLATFORM: string = 'OWN_PLATFORM';
	
	public static commonValues(): string[] {

		return [ this.IMPORTANCE, this.NAME, this.GROUP, this.OWN_PLATFORM ];
	}
}

/**
 * Abstract media items sort by options, publicly exposed via API
 */
export abstract class MediaItemSortBy {

	/**
	 * True if ASC, false if DESC
	 */
	@IsDefined()
	@IsBoolean()
	public ascending!: boolean;
}

/**
 * Abstract request for the 'add media item' API
 */
export abstract class AddMediaItemRequest extends CommonSaveRequest {

}

/**
 * Response for the 'add media item' API
 */
export class AddMediaItemResponse extends CommonAddResponse {

}

/**
 * Response for the 'delete media item' API
 */
export class DeleteMediaItemResponse extends CommonResponse {

}

/**
 * Abstract response for the 'get all media items' API
 */
export abstract class GetAllMediaItemsResponse extends CommonResponse {

}

/**
 * Abstract request for the 'update media item' API
 */
export abstract class UpdateMediaItemRequest extends CommonSaveRequest {

}

/**
 * Response for the 'update media item' API
 */
export class UpdateMediaItemResponse extends CommonResponse {

}

/**
 * Abstract request for the 'filter media items' API
 */
export abstract class FilterMediaItemsRequest extends CommonRequest {

}

/**
 * Abstract response for the 'filter media items' API
 */
export abstract class FilterMediaItemsResponse extends CommonResponse {

}

/**
 * Abstract request for the 'search media items' API
 */
export abstract class SearchMediaItemsRequest extends CommonRequest {

	/**
	 * The search term
	 */
	@IsNotEmpty()
	@IsString()
	public searchTerm!: string;
}

/**
 * Abstract response for the 'search media items' API
 */
export abstract class SearchMediaItemsResponse extends CommonResponse {

}

/**
 * Abstract model for a media item from the catalog, publicly exposed via API
 */
export abstract class CatalogMediaItem extends CoreMediaItemData {

}

/**
 * Abstract media item catalog search result, publicly exposed via API
 */
export abstract class SearchMediaItemCatalogResult {

	@IsNotEmpty()
	@IsString()
	public catalogId: string = '';
	
	@IsNotEmpty()
	@IsString()
	public name: string = '';

	@IsOptional()
	@IsDateString()
	public releaseDate?: string;
}

/**
 * Abstract response for the 'search catalog' API
 */
export abstract class SearchMediaItemCatalogResponse extends CommonResponse {

	/**
	 * The search results
	 */
	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return SearchMediaItemCatalogResult;
	})
	@ValidateNested()
	public searchResults: SearchMediaItemCatalogResult[] = [];
}

/**
 * Abstract response for the 'get from catalog' API
 */
export abstract class GetMediaItemFromCatalogResponse extends CommonResponse {

}

