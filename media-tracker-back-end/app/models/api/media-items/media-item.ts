import { IsNotEmpty, IsString, IsOptional, IsInt, ValidateNested, IsDefined, IsBoolean } from "class-validator";
import { Type } from "class-transformer";
import { CommonSaveRequest, CommonResponse, CommonRequest } from "../common";

/**
 * Abstract model for a media item from the catalog, publicly exposed via API
 */
export abstract class CatalogMediaItem {

	/**
	 * The media item name
	 */
	@IsNotEmpty()
	@IsString()
	name!: string;
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
	name!: string;

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
 * Model for a media item group data, publicly exposed via API
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
 * Abstract media items filtering options, publicly exposed via API
 */
export abstract class MediaItemFilter {

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
 * Common values for ordering options, publicly exposed via API
 */
export abstract class MediaItemSortField {

	static readonly IMPORTANCE: string = 'IMPORTANCE';
	static readonly NAME: string = 'NAME';
	static readonly GROUP: string = 'GROUP';
	
	public static commonValues(): string[] {

		return [this.IMPORTANCE, this.NAME, this.GROUP];
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
	ascending!: boolean;
}

/**
 * Abstract media item catalog search result, publicly exposed via API
 */
export abstract class SearchMediaItemCatalogResult {

	catalogId: number = 0;
    title: string = "";
	releaseDate?: string;
}

/**
 * Abstract request for the "add media item" API
 */
export abstract class AddMediaItemRequest extends CommonSaveRequest {

};

/**
 * Abstract response for the "add media item" API
 */
export abstract class AddMediaItemResponse extends CommonResponse {

}

/**
 * Abstract response for the "delete media item" API
 */
export abstract class DeleteMediaItemResponse extends CommonResponse {

}

/**
 * Abstract response for the "get all media items" API
 */
export abstract class GetAllMediaItemsResponse extends CommonResponse {

};

/**
 * Abstract request for the "update media item" API
 */
export abstract class UpdateMediaItemRequest extends CommonSaveRequest {

};

/**
 * Abstract response for the "update media item" API
 */
export abstract class UpdateMediaItemResponse extends CommonResponse {

}

/**
 * Abstract request for the "filter media items" API
 */
export abstract class FilterMediaItemsRequest extends CommonRequest {

};

/**
 * Abstract response for the "filter media items" API
 */
export abstract class FilterMediaItemsResponse extends CommonResponse {

}

/**
 * Abstract request for the "search media items" API
 */
export abstract class SearchMediaItemsRequest extends CommonRequest {

	/**
	 * The search term
	 */
	@IsNotEmpty()
	@IsString()
	searchTerm!: string;
};

/**
 * Abstract response for the "search media items" API
 */
export abstract class SearchMediaItemsResponse extends CommonResponse {

};

/**
 * Abstract response for the "search catalog" API
 */
export abstract class SearchMediaItemCatalogResponse extends CommonResponse {

	/**
	 * The search results
	 */
	searchResults: SearchMediaItemCatalogResult[] = [];
};

/**
 * Abstract response for the "get from catalog" API
 */
export abstract class GetMediaItemFromCatalogResponse extends CommonResponse {

};



















