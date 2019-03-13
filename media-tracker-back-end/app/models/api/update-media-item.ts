import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { MediaItem } from './media-item';
import { CommonRequest, CommonResponse } from './common';

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