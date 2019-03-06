import { MediaItem } from './media-item';
import { CommonRequest, CommonResponse } from './common';

/**
 * Request for the "addMediaItem" API
 */
export type AddMediaItemRequest = CommonRequest & {

	newMediaItem: MediaItem;
};

/**
 * Response for the "addMediaItem" API
 */
export type AddMediaItemResponse = CommonResponse;