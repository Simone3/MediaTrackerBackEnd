
import express, { Router } from 'express';
import { mediaItemController } from '../controllers/entities/media-item';
import {
	GetAllMediaItemsResponse, AddMediaItemResponse, UpdateMediaItemResponse, DeleteMediaItemResponse, AddMediaItemRequest,
	UpdateMediaItemRequest,	FilterMediaItemsResponse, FilterMediaItemsRequest, SearchMediaItemsRequest, SearchMediaItemsResponse, SearchMediaItemCatalogResponse
} from '../models/api/media-item';
import { mediaItemMapper } from '../mappers/media-item';
import { parserValidator } from '../controllers/utilities/parser-validator';

var router: Router = express.Router();

/**
 * Route to get all saved media items
 */
router.get('/users/:userId/categories/:categoryId/media-items', (request, response, __) => {

	const {
		userId,
		categoryId
	} = request.params;

	mediaItemController.getAllMediaItems(userId, categoryId)
		.then((mediaItems) => {

			const body: GetAllMediaItemsResponse = {
				mediaItems: mediaItemMapper.toApiMediaItemList(mediaItems)
			};
			
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot get all media items: ' + error);
		});
});

/**
 * Route to get saved media items with filtering/ordering options
 */
router.post('/users/:userId/categories/:categoryId/media-items/filter', (request, response, __) => {

	const {
		userId,
		categoryId
	} = request.params;

	parserValidator.parseAndValidate(FilterMediaItemsRequest, request.body)
		.then((body) => {

			const filterOptions = (body.filter ? mediaItemMapper.toInternalFilter(body.filter) : undefined);
			const orderOptions = (body.sortBy ? mediaItemMapper.toInternalSortList(body.sortBy) : undefined);
			return mediaItemController.filterAndOrderMediaItems(userId, categoryId, filterOptions, orderOptions);
		})
		.then((mediaItems) => {
		
			const body: FilterMediaItemsResponse = {
				mediaItems: mediaItemMapper.toApiMediaItemList(mediaItems)
			};

			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot filter media items: ' + error);
		});
});

/**
 * Route to search saved media items by term
 */
router.post('/users/:userId/categories/:categoryId/media-items/search', (request, response, __) => {

	const {
		userId,
		categoryId
	} = request.params;

	parserValidator.parseAndValidate(SearchMediaItemsRequest, request.body)
		.then((body) => {

			const filterBy = (body.filter ? mediaItemMapper.toInternalFilter(body.filter) : body.filter);
			const searchTerm = body.searchTerm;
			return mediaItemController.searchMediaItems(userId, categoryId, searchTerm, filterBy);
		})
		.then((result) => {

			const body: SearchMediaItemsResponse = {
				mediaItems: mediaItemMapper.toApiMediaItemList(result)
			};
			
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot search media items: ' + error);
		});
});

/**
 * Route to add a new media item
 */
router.post('/users/:userId/categories/:categoryId/media-items', (request, response, __) => {

	const {
		userId,
		categoryId
	} = request.params;

	parserValidator.parseAndValidate(AddMediaItemRequest, request.body)
		.then((body) => {

			const newMediaItem = mediaItemMapper.toInternalMediaItem(body.newMediaItem, userId, categoryId);
			return mediaItemController.saveMediaItem(newMediaItem)
		})
		.then(() => {
		
			const body: AddMediaItemResponse = {};
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot add media item: ' + error);
		});
});

/**
 * Route to update an existing media item
 */
router.put('/users/:userId/categories/:categoryId/media-items/:id', (request, response, __) => {

	const {
		id,
		userId,
		categoryId
	} = request.params;

	parserValidator.parseAndValidate(UpdateMediaItemRequest, request.body)
		.then((body) => {

			const mediaItem = mediaItemMapper.toInternalMediaItem(body.mediaItem, userId, categoryId);
			mediaItem._id = id;
			return mediaItemController.saveMediaItem(mediaItem)
		})
		.then(() => {
		
			const body: UpdateMediaItemResponse = {};
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot update media item: ' + error);
		});
});

/**
 * Route to delete a media item
 */
router.delete('/users/:userId/categories/:categoryId/media-items/:id', (request, response, __) => {

	const {id} = request.params;

	mediaItemController.deleteMediaItem(id)
		.then(() => {
			
			const body: DeleteMediaItemResponse = {};
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot delete media item: ' + error);
		});
});

/**
 * Route to search media items from the catalog by term
 */
router.get('/catalog/media-items/search/:searchTerm', (request, response, __) => {

	const {
		searchTerm
	} = request.params;

	mediaItemController.searchMediaItemCatalogByTerm(searchTerm)
		.then((searchResults) => {

			const body: SearchMediaItemCatalogResponse = {
				searchResults: mediaItemMapper.toApiCatalogSearchResultList(searchResults)
			};
			
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot search media item catalog: ' + error);
		});
});

/**
 * Router for media items API
 */
export const mediaItemRouter: Router = router;
