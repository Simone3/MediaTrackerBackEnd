
import express, { Router } from 'express';
import { mediaItemController } from '../controllers/media-item';
import { GetAllMediaItemsResponse } from '../models/api/get-all-media-items';
import { AddMediaItemResponse } from '../models/api/add-media-item';
import { mediaItemMapper } from '../mappers/media-item';
import { mediaItemValidator } from '../validators/media-item';
import { UpdateMediaItemResponse } from 'app/models/api/update-media-item';
import { DeleteMediaItemResponse } from 'app/models/api/delete-media-item';

var router: Router = express.Router();

/**
 * Route to get all saved media items
 */
router.get('/', (_, response, __) => {

	// Get media items from DB
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
router.post('/', (request, response, __) => {

	// Parse and validate request
	mediaItemValidator.parseAndValidateAddMediaItemRequest(request.body)
		.then((body) => {

			// Save media item to DB
			const newMediaItem = mediaItemMapper.apiToInternal(body.newMediaItem);
			mediaItemController.saveMediaItem(newMediaItem)
				.then(() => {
		
					const body: AddMediaItemResponse = {};
		
					response.json(body);
				})
				.catch((error) => {
		
					response.status(500).send('Cannot add media item: ' + error);
				});
		})
		.catch((error) => {

			response.status(500).send('Invalid request: ' + error);
		});
});

/**
 * Route to update an existing media item
 */
router.put('/:id', (request, response, __) => {

	// Parse and validate request
	mediaItemValidator.parseAndValidateUpdateMediaItemRequest(request.body)
		.then((body) => {

			// Save media item to DB
			const mediaItem = mediaItemMapper.apiToInternal(body.mediaItem);
			mediaItem._id = request.params.id;
			mediaItemController.saveMediaItem(mediaItem)
				.then(() => {
		
					const body: UpdateMediaItemResponse = {};
		
					response.json(body);
				})
				.catch((error) => {
		
					response.status(500).send('Cannot update media item: ' + error);
				});
		})
		.catch((error) => {

			response.status(500).send('Invalid request: ' + error);
		});
});

/**
 * Route to delete a media item
 */
router.delete('/:id', (request, response, __) => {

	mediaItemController.deleteMediaItem(request.params.id)
		.then(() => {
			
			const body: DeleteMediaItemResponse = {};

			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot delete media item: ' + error);
		});
});

/**
 * Router for media items API
 */
export const mediaItemRouter: Router = router;
