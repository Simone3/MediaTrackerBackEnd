import { MediaItemInternal } from '../models/internal/media-item';
import { IdentifiedMediaItem, MediaItem } from '../models/api/media-item';

/**
 * Helper class to translate between internal and public media item models
 */
class MediaItemMapper {

	/**
	 * List of internal models to list of public models
	 */
	public internalToApiList(sources: MediaItemInternal[]): IdentifiedMediaItem[] {

		return sources.map((source) => {

			return this.internalToApi(source);
		});
	}

	/**
	 * Internal model to public model
	 */
	public internalToApi(source: MediaItemInternal): IdentifiedMediaItem {
		
		return {
			uid: source._id,
			name: source.name,
			author: source.author
		};
	}

	/**
	 * List of public models to list of internal models
	 */
	public apiToInternalList<T extends (IdentifiedMediaItem | MediaItem)>(sources: T[], userId: string, categoryId: string): MediaItemInternal[] {

		return sources.map((source) => {

			return this.apiToInternal(source, userId, categoryId);
		});
	}

	/**
	 * Public model to internal model
	 */
	public apiToInternal<T extends (IdentifiedMediaItem | MediaItem)>(source: T, userId: string, categoryId: string): MediaItemInternal {

		const isNew = (source instanceof MediaItem);
		const id = (isNew ? null : (<IdentifiedMediaItem>source).uid);

		return {
			_id: id,
			name: source.name,
			author: source.author,
			category: categoryId,
			owner: userId
		};
	}
}

/**
 * Singleton instance of the media items mapper
 */
export const mediaItemMapper = new MediaItemMapper();


