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
	 * Saves a new or an existing media item, returning it back as a promise
	 * @param mediaItem the media item to insert or update
	 */
	public saveMediaItem(mediaItem: MediaItemInternal): Promise<MediaItemInternal> {

		return new Promise((resolve, reject) => {

			var mediaItemDocument = this.mapInternalToDocument(mediaItem);
			mediaItemDocument.isNew = !mediaItemDocument._id;

			mediaItemDocument.save((error: any, savedMediaItem: MediaItemDocument) => {
			   
				if(error) {
					
					reject(error);
				}
				else {

					if(savedMediaItem) {

						resolve(savedMediaItem);
					}
					else {

						reject('Media Item not found');
					}
				}
			});
		});
	}

	/**
	 * Deletes a media item with the given ID, returning a void promise
	 * @param id the media item ID
	 */
	public deleteMediaItem(id: string): Promise<void> {

		return new Promise((resolve, reject) => {

			MediaItemModel.findByIdAndRemove(id)
				.then((deletedMediaItem) => {

					if(deletedMediaItem) {

						resolve();
					}
					else {

						reject('Media Item not found');
					}
				})
				.catch((error: any) => {

					reject(error);
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


