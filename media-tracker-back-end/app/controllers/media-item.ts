import { Document, Model, model } from "mongoose";
import { MediaItemInternal } from "../models/internal/media-item";
import { MediaItemSchema, MEDIA_ITEM_COLLECTION_NAME } from "../schemas/media-item";
import { AbstractModelController } from "./helper";

/**
 * Media item document for Mongoose
 */
interface MediaItemDocument extends MediaItemInternal, Document {}

/**
 * Mongoose model for media items
 */
const MediaItemModel: Model<MediaItemDocument> = model<MediaItemDocument>(MEDIA_ITEM_COLLECTION_NAME, MediaItemSchema);

/**
 * Controller for media items, wraps the persistence logic
 */
class MediaItemController extends AbstractModelController {

	/**
	 * Gets all saved media items for the given user and category, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getAllMediaItems(userId: string, categoryId: string): Promise<MediaItemInternal[]> {

		return this.findHelper(MediaItemModel, {
			owner: userId,
			category: categoryId
		});
	}

	/**
	 * Saves a new or an existing media item, returning it back as a promise
	 * @param mediaItem the media item to insert or update
	 */
	public saveMediaItem(mediaItem: MediaItemInternal): Promise<MediaItemInternal> {

		return this.saveHelper(mediaItem, new MediaItemModel(), 'Media Item not found');
	}

	/**
	 * Deletes a media item with the given ID, returning a void promise
	 * @param id the media item ID
	 */
	public deleteMediaItem(id: string): Promise<void> {

		return this.deleteByIdHelper(MediaItemModel, id, 'Media Item not found');
	}

	/**
	 * Deletes all media items for the given category, returning the number of deleted elements as a promise
	 * @param categoryId category ID
	 */
	public deleteAllMediaItemsInCategory(categoryId: string): Promise<number> {

		return this.deleteHelper(MediaItemModel, {
			category: categoryId
		});
	}

	/**
	 * Deletes all media items for the given user, returning the number of deleted elements as a promise
	 * @param userId user ID
	 */
	public deleteAllMediaItemsForUser(userId: string): Promise<number> {

		return this.deleteHelper(MediaItemModel, {
			owner: userId
		});
	}
}

/**
 * Singleton implementation of the media item controller
 */
export const mediaItemController = new MediaItemController();


