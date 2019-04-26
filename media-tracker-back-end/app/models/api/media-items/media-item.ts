import { CommonAddResponse, CommonRequest, CommonResponse, CommonSaveRequest } from 'app/models/api/common';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Abstract model for a media item from the catalog, publicly exposed via API
 */
export abstract class CatalogMediaItem {

	/**
	 * The media item name
	 */
	@IsNotEmpty()
	@IsString()
	public name!: string;
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
	 * The group name
	 */
	@IsOptional()
	@IsString()
	public groupName?: string;

	/**
	 * The media item order inside the group
	 */
	@IsNotEmpty()
	@IsInt()
	public orderInGroup!: number;
}

/**
 * Abstract model for a media item, publicly exposed via API
 */
export abstract class MediaItem {

	/**
	 * The media item name
	 */
	@IsNotEmpty()
	@IsString()
	public name!: string;

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
}

/**
 * Common values for ordering options, publicly exposed via API
 */
export abstract class MediaItemSortField {

	public static readonly IMPORTANCE: string = 'IMPORTANCE';
	public static readonly NAME: string = 'NAME';
	public static readonly GROUP: string = 'GROUP';
	
	public static commonValues(): string[] {

		return [ this.IMPORTANCE, this.NAME, this.GROUP ];
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
 * Abstract media item catalog search result, publicly exposed via API
 */
export abstract class SearchMediaItemCatalogResult {

	public catalogId: string = '';
	public title: string = '';
	public releaseDate?: string;
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
 * Abstract response for the 'search catalog' API
 */
export abstract class SearchMediaItemCatalogResponse extends CommonResponse {

	/**
	 * The search results
	 */
	public searchResults: SearchMediaItemCatalogResult[] = [];
}

/**
 * Abstract response for the 'get from catalog' API
 */
export abstract class GetMediaItemFromCatalogResponse extends CommonResponse {

}

