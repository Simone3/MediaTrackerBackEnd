import { MediaItemInternal } from '../models/internal/media-item';
import { MediaItem } from '../models/api/media-item';

/**
 * Helper class to translate between internal and public media item models
 */
class MediaItemMapper {

	/**
	 * List of internal models to list of public models
	 */
	public internalToApiList(sources: MediaItemInternal[]): MediaItem[] {

		return sources.map((source) => {

			return this.internalToApi(source);
		});
	}

	/**
	 * Internal model to public model
	 */
	public internalToApi(source: MediaItemInternal): MediaItem {
		
		return {
			uid: source._id,
			name: source.name,
			author: source.author
		};
	}

	/**
	 * List of public models to list of internal models
	 */
	public apiToInternalList(sources: MediaItem[]): MediaItemInternal[] {

		return sources.map((source) => {

			return this.apiToInternal(source);
		});
	}

	/**
	 * Public model to internal model
	 */
	public apiToInternal(source: MediaItem): MediaItemInternal {

		return {
			_id: source.uid,
			name: source.name,
			author: source.author
		};
	}
}

/**
 * Singleton instance of the media items mapper
 */
export const mediaItemMapper = new MediaItemMapper();
