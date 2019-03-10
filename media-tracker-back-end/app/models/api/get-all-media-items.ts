import { MediaItem } from './media-item';
import { CommonResponse } from './common';

/**
 * Response for the "get all media items" API
 */
export class GetAllMediaItemsResponse extends CommonResponse {

	mediaItems: MediaItem[] = [];
};