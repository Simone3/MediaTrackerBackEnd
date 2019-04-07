import { Document, Model, model } from "mongoose";
import { MediaItemInternal, MediaItemFilterInternal, MediaItemSortFieldInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal } from "../../models/internal/media-item";
import { MediaItemSchema, MEDIA_ITEM_COLLECTION_NAME } from "../../schemas/media-item";
import { Queryable, Sortable, queryHelper } from "../database/query-helper";
import { miscUtilsController } from "../utilities/misc-utils";
import { TheMovieDbSearchQueryParams, TheMovieDbSearchResponse, TheMovieDbDetailsQueryParams, TheMovieDbDetailsResponse } from "../../models/external_services/movies";
import { config } from "../../config/config";
import { restJsonInvoker } from "../external_services/rest-json-invoker";
import { theMovieDbMapper } from "../../mappers/the-movie-db";
import { AppError } from "../../models/error/error";
import { logger } from "../../loggers/logger";

/**
 * Media item document for Mongoose
 */
interface MediaItemDocument extends MediaItemInternal, Document {}

/**
 * Mongoose model for media items
 */
const MediaItemModel: Model<MediaItemDocument> = model<MediaItemDocument>(MEDIA_ITEM_COLLECTION_NAME, MediaItemSchema);

/**
 * Helper type for media item query conditions
 */
type QueryConditions = Queryable<MediaItemInternal>;

/**
 * Helper type for media item soring conditions
 */
type OrderBy = Sortable<MediaItemInternal>

/**
 * Controller for media item entities
 */
class MediaItemController {

	/**
	 * Gets all saved media items for the given user and category, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getAllMediaItems(userId: string, categoryId: string): Promise<MediaItemInternal[]> {

		return this.filterAndOrderMediaItems(userId, categoryId);
	}

	/**
	 * Gets all media items matching the given filter and ordered with the given ordering options, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param filterBy filter options
	 * @param orderBy sort otions
	 */
	public filterAndOrderMediaItems(userId: string, categoryId: string, filterBy?: MediaItemFilterInternal, sortBy?: MediaItemSortByInternal[]): Promise<MediaItemInternal[]> {

		const conditions: QueryConditions = {
			owner: userId,
			category: categoryId
		};
		this.setConditionsFromFilter(conditions, filterBy);

		const sort: OrderBy = {};
		if(sortBy) {

			for(const value of sortBy) {

				switch(value.field) {

					case MediaItemSortFieldInternal.IMPORTANCE:
						sort.importance = value.ascending ? 'asc' : 'desc';
						break;

					case MediaItemSortFieldInternal.AUTHOR:
						sort.author = value.ascending ? 'asc' : 'desc';
						break;

					case MediaItemSortFieldInternal.NAME:
						sort.name = value.ascending ? 'asc' : 'desc';
						break;

					default:
						logger.error('Unexpected order by value: %s', value.field);
						throw AppError.GENERIC.withDetails('Unhandled orderBy value');
				}
			}
		}

		return queryHelper.find(MediaItemModel, conditions, sort);
	}

	/**
	 * Searches media items by term, returning the results divided in two lists: those matching the given filters and those not matching them
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param term the search term
	 * @param filterBy the optional filters
	 */
	public searchMediaItems(userId: string, categoryId: string, term: string, filterBy?: MediaItemFilterInternal): Promise<MediaItemInternal[]> {

		const termRegExp = new RegExp(miscUtilsController.escapeRegExp(term), 'i');
		
		const conditions: QueryConditions = {
			owner: userId,
			category: categoryId,
			$or: [{
				name: termRegExp
			}, {
				author: termRegExp
			}]
		};
		this.setConditionsFromFilter(conditions, filterBy);

		const sortBy: OrderBy = {
			name: 'asc'
		};

		return queryHelper.find(MediaItemModel, conditions, sortBy);
	}

	/**
	 * Saves a new or an existing media item, returning it back as a promise
	 * @param mediaItem the media item to insert or update
	 * @param allowSameName whether to check or not if an existing category has the same name
	 */
	public saveMediaItem(mediaItem: MediaItemInternal, allowSameName?: boolean): Promise<MediaItemInternal> {

		if(allowSameName) {

			logger.debug('Same name is allowed');
			return queryHelper.save(mediaItem, new MediaItemModel());
		}
		else {

			logger.debug('Same name is NOT allowed');
			const conditions: QueryConditions = {
				owner: mediaItem.owner,
				category: mediaItem.category,
				name: mediaItem.name
			};
			return queryHelper.checkUniquenessAndSave(MediaItemModel, mediaItem, new MediaItemModel(), conditions);
		}
	}

	/**
	 * Deletes a media item with the given ID, returning a void promise
	 * @param id the media item ID
	 */
	public deleteMediaItem(id: string): Promise<void> {

		return queryHelper.deleteById(MediaItemModel, id);
	}

	/**
	 * Deletes all media items for the given category, returning the number of deleted elements as a promise
	 * @param categoryId category ID
	 */
	public deleteAllMediaItemsInCategory(categoryId: string): Promise<number> {

		const conditions: QueryConditions = {
			category: categoryId
		};

		return queryHelper.delete(MediaItemModel, conditions);
	}

	/**
	 * Deletes all media items for the given user, returning the number of deleted elements as a promise
	 * @param userId user ID
	 */
	public deleteAllMediaItemsForUser(userId: string): Promise<number> {

		const conditions: QueryConditions = {
			owner: userId
		};

		return queryHelper.delete(MediaItemModel, conditions);
	}

	/**
	 * Helper to set the query conditions based on the given filters
	 */
	private setConditionsFromFilter(conditions: Queryable<MediaItemDocument>, filterBy?: MediaItemFilterInternal): void {
		
		if (filterBy) {
			
			if(filterBy.importance) {

				conditions.importance = filterBy.importance;
			}
		}
	}

	/**
	 * TODO move this method in the movies controller when the split is performed
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchMediaItemCatalogResultInternal[]> {

		return new Promise((resolve, reject) => {
		
			const url = miscUtilsController.buildUrl([config.externalApis.theMovieDb.basePath, config.externalApis.theMovieDb.searchRelativePath]);

			const queryParams: TheMovieDbSearchQueryParams = {
				query: searchTerm,
				api_key: config.externalApis.theMovieDb.apiKey
			};

			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: TheMovieDbSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			})
			.then((response) => {

				if(response.results) {

					resolve(theMovieDbMapper.toInternalCatalogSearchResultList(response.results));
				}
				else {

					resolve([]);
				}
			})
			.catch((error) => {
				
				logger.error('Movie catalog invocation error: %s', error);
				reject(AppError.GENERIC.unlessAppError(error));
			});
		});
	}

	/**
	 * TODO move this method in the movies controller when the split is performed
	 */
	public getMediaItemFromCatalog(catalogItemId: string): Promise<CatalogMediaItemInternal> {

		return new Promise((resolve, reject) => {
		
			const pathParams = {movieId: catalogItemId};
			const url = miscUtilsController.buildUrl([config.externalApis.theMovieDb.basePath, config.externalApis.theMovieDb.getDetailsRelativePath], pathParams);

			const queryParams: TheMovieDbDetailsQueryParams = {
				append_to_response: "credits",
				api_key: config.externalApis.theMovieDb.apiKey
			};

			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: TheMovieDbDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			})
			.then((response) => {

				resolve(theMovieDbMapper.toInternalMediaItem(response));
			})
			.catch((error) => {
				
				logger.error('Movie catalog invocation error: %s', error);
				reject(AppError.GENERIC.unlessAppError(error));
			});
		});
	}
}

/**
 * Singleton implementation of the media item controller
 */
export const mediaItemController = new MediaItemController();


