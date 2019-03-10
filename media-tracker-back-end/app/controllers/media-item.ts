import { Document, Model, model} from "mongoose";
import { MediaItemInternal } from "../models/internal/media-item";
import { MediaItemSchema } from "../schemas/media-item";

interface MediaItemDocument extends MediaItemInternal, Document {}

const MediaItemModel: Model<MediaItemDocument> = model<MediaItemDocument>("MediaItem", MediaItemSchema);

/**
 * Controller for media items, wraps the persistence logic
 */
class MediaItemController {

	/**
	 * Gets all saved media items, as a promise
	 */
	public getAllMediaItems(): Promise<MediaItemInternal[]> {

		return new Promise((resolve, reject) => {

			MediaItemModel.find()
				.then((mediaItems: MediaItemDocument[]) => {

					resolve(this.mapDocumentToInternalList(mediaItems));
				})
				.catch((error: any) => {

					reject(error);
				});
		});
	}

	/**
	 * Saves a new media item, returning it back as a promise
	 * @param newMediaItem the new media item
	 */
	public addMediaItem(newMediaItem: MediaItemInternal): Promise<MediaItemInternal> {

		return new Promise((resolve, reject) => {

			var mediaItemCreate = this.mapInternalToDocument(newMediaItem);

			mediaItemCreate.save((error: any, mediaItemCreate: MediaItemDocument) => {
			   
				if(error) {
					
					reject(error);
				}
				else {

					resolve(mediaItemCreate);
				}
			});
		});
	}

	/**
	 * Helper
	 */
	private mapInternalToDocument(source: MediaItemInternal): MediaItemDocument {

		var target: MediaItemDocument = new MediaItemModel();
		target = Object.assign(target, source);
		return target;
	}
	
	/**
	 * Helper
	 */
	private mapDocumentToInternalList(sources: MediaItemDocument[]): MediaItemInternal[] {

		return sources.map((source) => {

			return this.mapDocumentToInternal(source);
		});
	}

	/**
	 * Helper
	 */
	private mapDocumentToInternal(source: MediaItemDocument): MediaItemInternal {

		return source;
	}
}

/**
 * Singleton implementation of the media item controller
 */
export const mediaItemController = new MediaItemController();


