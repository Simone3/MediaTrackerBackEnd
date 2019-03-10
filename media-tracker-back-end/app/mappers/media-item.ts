import { MediaItemInternal } from '../models/internal/media-item';
import { MediaItem, NewMediaItem } from '../models/api/media-item';

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
	public apiToInternalList<T extends (MediaItem | NewMediaItem)>(sources: T[]): MediaItemInternal[] {

		return sources.map((source) => {

			return this.apiToInternal(source);
		});
	}

	/**
	 * Public model to internal model
	 */
	public apiToInternal<T extends (MediaItem | NewMediaItem)>(source: T): MediaItemInternal {

		const isNew = (source instanceof NewMediaItem);
		const id = (isNew ? null : (<MediaItem>source).uid);

		return {
			_id: id,
			name: source.name,
			author: source.author
		};
	}
}

/**
 * Singleton instance of the media items mapper
 */
export const mediaItemMapper = new MediaItemMapper();


