import { NewMediaItem } from './media-item';
import { CommonRequest, CommonResponse } from './common';

/**
 * Request for the "add media item" API
 */
export type AddMediaItemRequest = CommonRequest & {

	newMediaItem: NewMediaItem;
};

/**
 * Response for the "add media item" API
 */
export type AddMediaItemResponse = CommonResponse;