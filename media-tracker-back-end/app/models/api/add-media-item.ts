import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { NewMediaItem } from './media-item';
import { CommonRequest, CommonResponse } from './common';

/**
 * Request for the "add media item" API
 */
export class AddMediaItemRequest extends CommonRequest {

	@IsDefined()
	@Type(() => NewMediaItem)
	@ValidateNested()
	newMediaItem!: NewMediaItem;
};

/**
 * Response for the "add media item" API
 */
export class AddMediaItemResponse extends CommonResponse {

}