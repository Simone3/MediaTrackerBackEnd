
import express, { Router, Response } from 'express';
import { mediaItemController } from '../controllers/media-item';
import { GetAllMediaItemsResponse } from '../model/api/get-all-media-items';
import { MediaItemInternal } from '../model/internal/media-item';
import { AddMediaItemResponse } from '../model/api/add-media-item';
import { mediaItemMapper } from '../model/mappers/media-item';

var router: Router = express.Router();

/**
 * Route to get all saved media items
 */
router.get('/', (_, response: Response, __) => {

	mediaItemController.getAllMediaItems()
		.then((mediaItems) => {

			const body: GetAllMediaItemsResponse = {
				mediaItems: mediaItemMapper.internalToApiList(mediaItems)
			};
			
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot get all media items: ' + error);
		});
});

/**
 * Route to add a new media item
 */
router.post('/', (_, response: Response, __) => {

	// TODO build this from request!
	var newMediaItem: MediaItemInternal = {

		_id: null,
		name: 'My New Media Item'
	};

	mediaItemController.addMediaItem(newMediaItem)
		.then(() => {

			const body: AddMediaItemResponse = {};

			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot add media item: ' + error);
		});
});

/**
 * Router for media items API
 */
export const mediaItemRouter: Router = router;
