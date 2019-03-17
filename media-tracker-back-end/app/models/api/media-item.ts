import { IsNotEmpty, IsOptional, IsString, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonRequest, CommonResponse } from './common';

/**
 * Model for a media item, publicly exposed via API
 */
export class MediaItem {

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
};

/**
 * Model for a media item with an ID property, publicly exposed via API
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
 * Request for the "add media item" API
 */
export class AddMediaItemRequest extends CommonRequest {

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

	mediaItems: IdentifiedMediaItem[] = [];
};

/**
 * Request for the "update media item" API
 */
export class UpdateMediaItemRequest extends CommonRequest {

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