import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * Model for the old Media Tracker app media item, internal type NOT to be exposed via API
 */
export type OldAppMediaItemInternal<T extends MediaItemInternal> = {

	mediaItemData: T;
	owned: boolean;
}
