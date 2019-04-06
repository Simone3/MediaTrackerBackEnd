
import express, { Router } from 'express';
import { mediaItemController } from '../controllers/entities/media-item';
import {
	GetAllMediaItemsResponse, AddMediaItemResponse, UpdateMediaItemResponse, DeleteMediaItemResponse, AddMediaItemRequest,
	UpdateMediaItemRequest,	FilterMediaItemsResponse, FilterMediaItemsRequest, SearchMediaItemsRequest, SearchMediaItemsResponse, SearchMediaItemCatalogResponse, GetMediaItemFromCatalogResponse
} from '../models/api/media-item';
import { mediaItemMapper } from '../mappers/media-item';
import { parserValidator } from '../controllers/utilities/parser-validator';
import { ErrorResponse } from '../models/api/common';
import { AppError } from '../models/error/error';

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

			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
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
			mediaItemController.filterAndOrderMediaItems(userId, categoryId, filterOptions, orderOptions)
				.then((mediaItems) => {
				
					const body: FilterMediaItemsResponse = {
						mediaItems: mediaItemMapper.toApiMediaItemList(mediaItems)
					};

					response.json(body);
				})
				.catch((error) => {

					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				})
		})
		.catch((error) => {

			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
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
			mediaItemController.searchMediaItems(userId, categoryId, searchTerm, filterBy)
				.then((result) => {

					const body: SearchMediaItemsResponse = {
						mediaItems: mediaItemMapper.toApiMediaItemList(result)
					};
					
					response.json(body);
				})
				.catch((error) => {

					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				})
		})
		.catch((error) => {

			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
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
			mediaItemController.saveMediaItem(newMediaItem)
				.then(() => {
				
					const body: AddMediaItemResponse = {
						message: 'Media item successfully added'
					};
	
					response.json(body);
				})
				.catch((error) => {

					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				})
		})
		.catch((error) => {

			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
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
			mediaItemController.saveMediaItem(mediaItem)
				.then(() => {
				
					const body: UpdateMediaItemResponse = {
						message: 'Media item successfully updated'
					};
	
					response.json(body);
				})
				.catch((error) => {

					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				})
		})
		.catch((error) => {

			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
		});
});

/**
 * Route to delete a media item
 */
router.delete('/users/:userId/categories/:categoryId/media-items/:id', (request, response, __) => {

	const {id} = request.params;

	mediaItemController.deleteMediaItem(id)
		.then(() => {
			
			const body: DeleteMediaItemResponse = {
				message: 'Media item successfully deleted'
			};

			response.json(body);
		})
		.catch((error) => {

			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
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

			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
		});
});

/**
 * Route to get the details for a catalog media item
 */
router.get('/catalog/media-items/:catalogId', (request, response, __) => {

	const {
		catalogId
	} = request.params;

	mediaItemController.getMediaItemFromCatalog(catalogId)
		.then((catalogMediaItem) => {

			const body: GetMediaItemFromCatalogResponse = {
				catalogDetails: mediaItemMapper.toApiCatalogDetails(catalogMediaItem)
			};
			
			response.json(body);
		})
		.catch((error) => {

			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
		});
});

/**
 * Router for media items API
 */
export const mediaItemRouter: Router = router;
