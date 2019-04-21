
import express, { Router } from 'express';
import {
	GetAllMediaItemsResponse, AddMediaItemResponse, UpdateMediaItemResponse, DeleteMediaItemResponse, AddMediaItemRequest,
	UpdateMediaItemRequest,	FilterMediaItemsResponse, FilterMediaItemsRequest, SearchMediaItemsRequest, SearchMediaItemsResponse, SearchMediaItemCatalogResponse, GetMediaItemFromCatalogResponse, MediaItem
} from '../../models/api/media-items/media-item';
import { parserValidator } from '../../controllers/utilities/parser-validator';
import { ErrorResponse } from '../../models/api/common';
import { AppError } from '../../models/error/error';
import { logger } from '../../loggers/logger';
import { MediaItemController, MediaItemCatalogController } from 'app/controllers/entities/media-items/media-item';
import { MediaItemInternal, MediaItemSortByInternal, MediaItemFilterInternal, SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal } from 'app/models/internal/media-items/media-item';
import { ClassType } from 'class-transformer/ClassTransformer';

/**
 * Helper class for common router builder
 */
abstract class AbstractRouterBuilder {

	/**
	 * The Express router
	 */
	private _router: Router;

	constructor() {

		this._router = express.Router();
	}

	public get router(): Router {

		return this._router;
	}
}

/**
 * Helper class to build the media item Express routes
 * @template E the media item entity
 * @template S the media item sort conditions 
 * @template F the media item filter conditions
 */
export class MediaItemRouterBuilder<E extends MediaItemInternal, S extends MediaItemSortByInternal, F extends MediaItemFilterInternal> extends AbstractRouterBuilder {

	/**
	 * Constructor
	 * @param mediaItemPathName the media item name to use in the API paths
	 * @param mediaItemController the controller implementation
	 */
	constructor(private mediaItemPathName: string, private mediaItemController: MediaItemController<E, S, F>) {
		
		super();
	}
	
	/**
	 * Route to get all saved media items
	 * @param routeConfig the route configuration
	 * @param routeConfig.responseBuilder builder of final response starting from common data and controller result
	 * @template O the API output
	 */
	public getAll<O extends GetAllMediaItemsResponse>(routeConfig: {
		responseBuilder: TWriteResponse<GetAllMediaItemsResponse, E[], O>
	}): void {

		this.router.get('/users/:userId/categories/:categoryId/' + this.mediaItemPathName, (request, response, __) => {

			const {
				userId,
				categoryId
			} = request.params;

			this.mediaItemController.getAllMediaItems(userId, categoryId)
				.then((mediaItems) => {

					const body: O = routeConfig.responseBuilder({}, mediaItems);
					
					response.json(body);
				})
				.catch((error) => {

					logger.error('Get media items generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				});
		});
	}
	
	/**
	 * Route to get saved media items with filtering/ordering options
	 * @param routeConfig the route configuration
	 * @param routeConfig.requestClass the route request class
	 * @param routeConfig.filterRequestReader getter for filter parameter from the parsed request
	 * @param routeConfig.sortRequestReader getter for sort parameter from the parsed request
	 * @param routeConfig.responseBuilder builder of final response starting from common data and controller result
	 * @template I the API input
	 * @template O the API output
	 */
	public filter<I extends FilterMediaItemsRequest, O extends FilterMediaItemsResponse>(routeConfig: {
		requestClass: ClassType<I>,
		filterRequestReader: TReadRequestOptional<I, F>,
		sortRequestReader: TReadRequestOptional<I, S[]>,
		responseBuilder: TWriteResponse<FilterMediaItemsResponse, E[], O>
	}): void {

		this.router.post('/users/:userId/categories/:categoryId/' + this.mediaItemPathName + '/filter', (request, response, __) => {

			const {
				userId,
				categoryId
			} = request.params;

			parserValidator.parseAndValidate(routeConfig.requestClass, request.body)
				.then((body) => {

					const filterOptions = routeConfig.filterRequestReader(body);
					const orderOptions = routeConfig.sortRequestReader(body);

					this.mediaItemController.filterAndOrderMediaItems(userId, categoryId, filterOptions, orderOptions)
						.then((mediaItems) => {
						
							const body: O = routeConfig.responseBuilder({}, mediaItems);
							
							response.json(body);
						})
						.catch((error) => {

							logger.error('Filter media items generic error: %s', error);
							response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
						})
				})
				.catch((error) => {

					logger.error('Filter media items request error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
				});
		});
	}

	/**
	 * Route to search saved media items by term
	 * @param routeConfig the route configuration
	 * @param routeConfig.requestClass the route request class
	 * @param routeConfig.filterRequestReader getter for filter parameter from the parsed request
	 * @param routeConfig.responseBuilder builder of final response starting from common data and controller result
	 * @template I the API input
	 * @template O the API output
	 */
	public search<I extends SearchMediaItemsRequest, O extends SearchMediaItemsResponse>(routeConfig: {
		requestClass: ClassType<I>,
		filterRequestReader: TReadRequestOptional<I, F>,
		responseBuilder: TWriteResponse<SearchMediaItemsResponse, E[], O>
	}): void {

		this.router.post('/users/:userId/categories/:categoryId/' + this.mediaItemPathName + '/search', (request, response, __) => {

			const {
				userId,
				categoryId
			} = request.params;

			parserValidator.parseAndValidate(routeConfig.requestClass, request.body)
				.then((body) => {

					const filterBy = routeConfig.filterRequestReader(body);
					const searchTerm = body.searchTerm;

					this.mediaItemController.searchMediaItems(userId, categoryId, searchTerm, filterBy)
						.then((mediaItems) => {

							const body: O = routeConfig.responseBuilder({}, mediaItems);
							
							response.json(body);
						})
						.catch((error) => {

							logger.error('Search media items generic error: %s', error);
							response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
						})
				})
				.catch((error) => {

					logger.error('Search media items request error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
				});
		});
	}
	
	/**
	 * Route to add a new media item
	 * @param routeConfig the route configuration
	 * @param routeConfig.requestClass the route request class
	 * @param routeConfig.mediaItemRequestReader getter for media item parameter from the parsed request
	 * @template I the API input
	 */
	public addNew<I extends AddMediaItemRequest>(routeConfig: {
		requestClass: ClassType<I>,
		mediaItemRequestReader: TReadRequestWithExtraData<I, E>
	}): void {

		this.router.post('/users/:userId/categories/:categoryId/' + this.mediaItemPathName, (request, response, __) => {

			const {
				userId,
				categoryId
			} = request.params;

			parserValidator.parseAndValidate(routeConfig.requestClass, request.body)
				.then((body) => {

					const newMediaItem = routeConfig.mediaItemRequestReader(body, "", userId, categoryId);

					this.mediaItemController.saveMediaItem(newMediaItem, body.allowSameName)
						.then(() => {
						
							const body: AddMediaItemResponse = {
								message: 'Media item successfully added'
							};
			
							response.json(body);
						})
						.catch((error) => {

							logger.error('Add media item generic error: %s', error);
							response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
						})
				})
				.catch((error) => {

					logger.error('Add media item request error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
				});
		});
	}

	/**
	 * Route to update an existing media item
	 * @param routeConfig the route configuration
	 * @param routeConfig.requestClass the route request class
	 * @param routeConfig.mediaItemRequestReader getter for media item parameter from the parsed request
	 * @template I the API input
	 */
	public updateExisting<I extends UpdateMediaItemRequest>(routeConfig: {
		requestClass: ClassType<I>,
		mediaItemRequestReader: TReadRequestWithExtraData<I, E>
	}): void {

		this.router.put('/users/:userId/categories/:categoryId/' + this.mediaItemPathName + '/:id', (request, response, __) => {

			const {
				id,
				userId,
				categoryId
			} = request.params;

			parserValidator.parseAndValidate(routeConfig.requestClass, request.body)
				.then((body) => {

					const mediaItem = routeConfig.mediaItemRequestReader(body, id, userId, categoryId);

					this.mediaItemController.saveMediaItem(mediaItem, body.allowSameName)
						.then(() => {
						
							const body: UpdateMediaItemResponse = {
								message: 'Media item successfully updated'
							};
			
							response.json(body);
						})
						.catch((error) => {
							
							logger.error('Update media item generic error: %s', error);
							response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
						})
				})
				.catch((error) => {

					logger.error('Update media item request error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
				});
		});
	}

	/**
	 * Route to delete a media item
	 */
	public delete(): void {

		this.router.delete('/users/:userId/categories/:categoryId/' + this.mediaItemPathName + '/:id', (request, response, __) => {

			const {
				userId,
				categoryId,
				id
			} = request.params;

			this.mediaItemController.deleteMediaItem(userId, categoryId, id)
				.then(() => {
					
					const body: DeleteMediaItemResponse = {
						message: 'Media item successfully deleted'
					};

					response.json(body);
				})
				.catch((error) => {

					logger.error('Delete media item generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				});
		});
	}
}

/**
 * Helper class to build the media item catalog Express routes
 * @template S the media item catalog search result
 * @template C the media item catalog details
 */
export class MediaItemCatalogRouterBuilder<S extends SearchMediaItemCatalogResultInternal, C extends CatalogMediaItemInternal> extends AbstractRouterBuilder {

	/**
	 * Constructor
	 * @param mediaItemPathName the media item name to use in the API paths
	 * @param mediaItemCatalogController the controller implementation
	 */
	constructor(private mediaItemPathName: string, private mediaItemCatalogController: MediaItemCatalogController<S, C>) {
		
		super();
	}

	/**
	 * Route to search media items from the catalog by term
	 * @param routeConfig the route configuration
	 * @param routeConfig.responseBuilder builder of final response starting from common data and controller result
	 * @template O the API output
	 */
	public search<O extends SearchMediaItemCatalogResponse>(routeConfig: {
		responseBuilder: TWriteResponse<SearchMediaItemCatalogResponse, S[], O>
	}): void {

		this.router.get('/catalog/' + this.mediaItemPathName + '/search/:searchTerm', (request, response, __) => {

			const {
				searchTerm
			} = request.params;

			this.mediaItemCatalogController.searchMediaItemCatalogByTerm(searchTerm)
				.then((searchResults) => {

					const body: O = routeConfig.responseBuilder({searchResults: []}, searchResults);

					response.json(body);
				})
				.catch((error) => {

					logger.error('Media item catalog search generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				});
		});
	}

	/**
	 * Route to get the details for a catalog media item
	 * @param routeConfig the route configuration
	 * @param routeConfig.responseBuilder builder of final response starting from common data and controller result
	 * @template O the API output
	 */
	public details<O extends GetMediaItemFromCatalogResponse>(routeConfig: {
		responseBuilder: TWriteResponse<GetMediaItemFromCatalogResponse, C, O>
	}): void {

		this.router.get('/catalog/' + this.mediaItemPathName + '/:catalogId', (request, response, __) => {

			const {
				catalogId
			} = request.params;

			this.mediaItemCatalogController.getMediaItemFromCatalog(catalogId)
				.then((catalogMediaItem) => {

					const body: O = routeConfig.responseBuilder({}, catalogMediaItem);
					
					response.json(body);
				})
				.catch((error) => {

					logger.error('Media item catalog details generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				});
		});
	}
}

/**
 * Helper type for a request getter
 */
type TReadRequestOptional<T1, T2> = (request: T1) => T2 | undefined;

/**
 * Helper type for a request getter with extra input data
 */
type TReadRequestWithExtraData<T1, T2> = (request: T1, mediaItemId: string, userId: string, categoryId: string) => T2;

/**
 * Helper type for a response builder
 */
type TWriteResponse<T1, T2, T3 extends T1> = (commonResponse: T1, result: T2) => T3;