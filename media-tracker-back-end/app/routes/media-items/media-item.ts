import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { MediaItemEntityController } from 'app/controllers/entities/media-items/media-item';
import { logger } from 'app/loggers/logger';
import { ErrorResponse } from 'app/models/api/common';
import { AddMediaItemRequest, AddMediaItemResponse, DeleteMediaItemResponse, FilterMediaItemsRequest, FilterMediaItemsResponse, GetAllMediaItemsResponse, GetMediaItemFromCatalogResponse, SearchMediaItemCatalogResponse, SearchMediaItemsRequest, SearchMediaItemsResponse, UpdateMediaItemRequest, UpdateMediaItemResponse } from 'app/models/api/media-items/media-item';
import { AppError } from 'app/models/error/error';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';
import { parserValidator } from 'app/utilities/parser-validator';
import { ClassType } from 'class-transformer/ClassTransformer';
import express, { Router } from 'express';

/**
 * Helper class for common router builder
 */
abstract class AbstractRouterBuilder {

	/**
	 * The Express router
	 */
	private _router: Router;

	/**
	 * Constructor
	 */
	protected constructor() {

		this._router = express.Router();
	}

	public get router(): Router {

		return this._router;
	}
}

/**
 * Helper class to build the media item Express routes
 * @template TMediaItemInternal the media item entity
 * @template TMediaItemSortByInternal the media item sort conditions
 * @template TMediaItemFilterInternal the media item filter conditions
 */
export class MediaItemEntityRouterBuilder<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> extends AbstractRouterBuilder {

	/**
	 * Constructor
	 * @param mediaItemPathName the media item name to use in the API paths
	 * @param mediaItemController the controller implementation
	 */
	public constructor(private mediaItemPathName: string, private mediaItemController: MediaItemEntityController<TMediaItemInternal, TMediaItemSortByInternal, TMediaItemFilterInternal>) {
		
		super();
	}
	
	/**
	 * Route to get all saved media items
	 * @param routeConfig the route configuration
	 * @param routeConfig.responseBuilder builder of final response starting from common data and controller result
	 * @template TResponse the API output
	 */
	public getAll<TResponse extends GetAllMediaItemsResponse>(routeConfig: {
		responseBuilder: TWriteResponse<GetAllMediaItemsResponse, TMediaItemInternal[], TResponse>;
	}): void {

		this.router.get(`/users/:userId/categories/:categoryId/${this.mediaItemPathName}`, (request, response): void => {

			const userId: string = request.params.userId;
			const categoryId: string = request.params.categoryId;

			this.mediaItemController.getAllMediaItems(userId, categoryId)
				.then((mediaItems) => {

					const responseBody: TResponse = routeConfig.responseBuilder({}, mediaItems);
					
					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Get media items generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
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
	 * @template TRequest the API input
	 * @template TResponse the API output
	 */
	public filter<TRequest extends FilterMediaItemsRequest, TResponse extends FilterMediaItemsResponse>(routeConfig: {
		requestClass: ClassType<TRequest>;
		filterRequestReader: TReadRequestOptional<TRequest, TMediaItemFilterInternal>;
		sortRequestReader: TReadRequestOptional<TRequest, TMediaItemSortByInternal[]>;
		responseBuilder: TWriteResponse<FilterMediaItemsResponse, TMediaItemInternal[], TResponse>;
	}): void {

		this.router.post(`/users/:userId/categories/:categoryId/${this.mediaItemPathName}/filter`, (request, response) => {

			const userId: string = request.params.userId;
			const categoryId: string = request.params.categoryId;

			parserValidator.parseAndValidate(routeConfig.requestClass, request.body)
				.then((parsedRequest) => {

					const filterOptions = routeConfig.filterRequestReader(parsedRequest);
					const orderOptions = routeConfig.sortRequestReader(parsedRequest);

					this.mediaItemController.filterAndOrderMediaItems(userId, categoryId, filterOptions, orderOptions)
						.then((mediaItems) => {
						
							const responseBody: TResponse = routeConfig.responseBuilder({}, mediaItems);
							
							response.json(responseBody);
						})
						.catch((error) => {

							logger.error('Filter media items generic error: %s', error);
							response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
						});
				})
				.catch((error) => {

					logger.error('Filter media items request error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.withDetails(error)));
				});
		});
	}

	/**
	 * Route to search saved media items by term
	 * @param routeConfig the route configuration
	 * @param routeConfig.requestClass the route request class
	 * @param routeConfig.filterRequestReader getter for filter parameter from the parsed request
	 * @param routeConfig.responseBuilder builder of final response starting from common data and controller result
	 * @template TRequest the API input
	 * @template TResponse the API output
	 */
	public search<TRequest extends SearchMediaItemsRequest, TResponse extends SearchMediaItemsResponse>(routeConfig: {
		requestClass: ClassType<TRequest>;
		filterRequestReader: TReadRequestOptional<TRequest, TMediaItemFilterInternal>;
		responseBuilder: TWriteResponse<SearchMediaItemsResponse, TMediaItemInternal[], TResponse>;
	}): void {

		this.router.post(`/users/:userId/categories/:categoryId/${this.mediaItemPathName}/search`, (request, response) => {

			const userId: string = request.params.userId;
			const categoryId: string = request.params.categoryId;

			parserValidator.parseAndValidate(routeConfig.requestClass, request.body)
				.then((parsedRequest) => {

					const filterBy = routeConfig.filterRequestReader(parsedRequest);
					const searchTerm = parsedRequest.searchTerm;

					this.mediaItemController.searchMediaItems(userId, categoryId, searchTerm, filterBy)
						.then((mediaItems) => {

							const responseBody: TResponse = routeConfig.responseBuilder({}, mediaItems);
							
							response.json(responseBody);
						})
						.catch((error) => {

							logger.error('Search media items generic error: %s', error);
							response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
						});
				})
				.catch((error) => {

					logger.error('Search media items request error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.withDetails(error)));
				});
		});
	}
	
	/**
	 * Route to add a new media item
	 * @param routeConfig the route configuration
	 * @param routeConfig.requestClass the route request class
	 * @param routeConfig.mediaItemRequestReader getter for media item parameter from the parsed request
	 * @template TRequest the API input
	 */
	public addNew<TRequest extends AddMediaItemRequest>(routeConfig: {
		requestClass: ClassType<TRequest>;
		mediaItemRequestReader: TReadRequestWithExtraData<TRequest, TMediaItemInternal>;
	}): void {

		this.router.post(`/users/:userId/categories/:categoryId/${this.mediaItemPathName}`, (request, response) => {

			const userId: string = request.params.userId;
			const categoryId: string = request.params.categoryId;

			parserValidator.parseAndValidate(routeConfig.requestClass, request.body)
				.then((parsedRequest) => {

					const newMediaItem = routeConfig.mediaItemRequestReader(parsedRequest, '', userId, categoryId);

					this.mediaItemController.saveMediaItem(newMediaItem)
						.then((savedMediaItem) => {
						
							const responseBody: AddMediaItemResponse = {
								message: 'Media item successfully added',
								uid: savedMediaItem._id
							};
			
							response.json(responseBody);
						})
						.catch((error) => {

							logger.error('Add media item generic error: %s', error);
							response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
						});
				})
				.catch((error) => {

					logger.error('Add media item request error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.withDetails(error)));
				});
		});
	}

	/**
	 * Route to update an existing media item
	 * @param routeConfig the route configuration
	 * @param routeConfig.requestClass the route request class
	 * @param routeConfig.mediaItemRequestReader getter for media item parameter from the parsed request
	 * @template TRequest the API input
	 */
	public updateExisting<TRequest extends UpdateMediaItemRequest>(routeConfig: {
		requestClass: ClassType<TRequest>;
		mediaItemRequestReader: TReadRequestWithExtraData<TRequest, TMediaItemInternal>;
	}): void {

		this.router.put(`/users/:userId/categories/:categoryId/${this.mediaItemPathName}/:id`, (request, response) => {

			const userId: string = request.params.userId;
			const categoryId: string = request.params.categoryId;
			const id: string = request.params.id;

			parserValidator.parseAndValidate(routeConfig.requestClass, request.body)
				.then((parsedRequest) => {

					const mediaItem = routeConfig.mediaItemRequestReader(parsedRequest, id, userId, categoryId);

					this.mediaItemController.saveMediaItem(mediaItem)
						.then(() => {
						
							const responseBody: UpdateMediaItemResponse = {
								message: 'Media item successfully updated'
							};
			
							response.json(responseBody);
						})
						.catch((error) => {
							
							logger.error('Update media item generic error: %s', error);
							response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
						});
				})
				.catch((error) => {

					logger.error('Update media item request error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.withDetails(error)));
				});
		});
	}

	/**
	 * Route to delete a media item
	 */
	public delete(): void {

		this.router.delete(`/users/:userId/categories/:categoryId/${this.mediaItemPathName}/:id`, (request, response) => {

			const userId: string = request.params.userId;
			const categoryId: string = request.params.categoryId;
			const id: string = request.params.id;

			this.mediaItemController.deleteMediaItem(userId, categoryId, id)
				.then(() => {
					
					const responseBody: DeleteMediaItemResponse = {
						message: 'Media item successfully deleted'
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Delete media item generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
				});
		});
	}
}

/**
 * Helper class to build the media item catalog Express routes
 * @template TSearchMediaItemCatalogResultInternal the media item catalog search result
 * @template TCatalogMediaItemInternal the media item catalog details
 */
export class MediaItemCatalogRouterBuilder<TSearchMediaItemCatalogResultInternal extends SearchMediaItemCatalogResultInternal, TCatalogMediaItemInternal extends CatalogMediaItemInternal> extends AbstractRouterBuilder {

	/**
	 * Constructor
	 * @param mediaItemPathName the media item name to use in the API paths
	 * @param mediaItemCatalogController the controller implementation
	 */
	public constructor(private mediaItemPathName: string, private mediaItemCatalogController: MediaItemCatalogController<TSearchMediaItemCatalogResultInternal, TCatalogMediaItemInternal>) {
		
		super();
	}

	/**
	 * Route to search media items from the catalog by term
	 * @param routeConfig the route configuration
	 * @param routeConfig.responseBuilder builder of final response starting from common data and controller result
	 * @template TResponse the API output
	 */
	public search<TResponse extends SearchMediaItemCatalogResponse>(routeConfig: {
		responseBuilder: TWriteResponse<SearchMediaItemCatalogResponse, TSearchMediaItemCatalogResultInternal[], TResponse>;
	}): void {

		this.router.get(`/catalog/${this.mediaItemPathName}/search/:searchTerm`, (request, response) => {

			const searchTerm: string = request.params.searchTerm;

			this.mediaItemCatalogController.searchMediaItemCatalogByTerm(searchTerm)
				.then((searchResults) => {

					const responseBody: TResponse = routeConfig.responseBuilder({ searchResults: [] }, searchResults);

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Media item catalog search generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
				});
		});
	}

	/**
	 * Route to get the details for a catalog media item
	 * @param routeConfig the route configuration
	 * @param routeConfig.responseBuilder builder of final response starting from common data and controller result
	 * @template TResponse the API output
	 */
	public details<TResponse extends GetMediaItemFromCatalogResponse>(routeConfig: {
		responseBuilder: TWriteResponse<GetMediaItemFromCatalogResponse, TCatalogMediaItemInternal, TResponse>;
	}): void {

		this.router.get(`/catalog/${this.mediaItemPathName}/:catalogId`, (request, response) => {

			const catalogId: string = request.params.catalogId;

			this.mediaItemCatalogController.getMediaItemFromCatalog(catalogId)
				.then((catalogMediaItem) => {

					const responseBody: TResponse = routeConfig.responseBuilder({}, catalogMediaItem);
					
					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Media item catalog details generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
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
