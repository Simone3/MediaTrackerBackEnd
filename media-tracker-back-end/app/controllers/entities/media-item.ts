import { Document, Model, model } from "mongoose";
import { MediaItemInternal, MediaItemFilterInternal, MediaItemSortFieldInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal } from "../../models/internal/media-item";
import { MediaItemSchema, MEDIA_ITEM_COLLECTION_NAME } from "../../schemas/media-item";
import { Queryable, Sortable, queryHelper, SortDirection } from "../database/query-helper";
import { miscUtilsController } from "../utilities/misc-utils";
import { TheMovieDbSearchQueryParams, TheMovieDbSearchResponse, TheMovieDbDetailsQueryParams, TheMovieDbDetailsResponse } from "../../models/external_services/movies";
import { config } from "../../config/config";
import { restJsonInvoker } from "../external_services/rest-json-invoker";
import { theMovieDbMapper } from "../../mappers/the-movie-db";
import { AppError } from "../../models/error/error";
import { logger } from "../../loggers/logger";
import { AbstractEntityController } from "./helper";
import { UserInternal } from "app/models/internal/user";
import { CategoryInternal } from "app/models/internal/category";
import { GroupInternal } from "app/models/internal/group";
import { categoryController } from "./category";
import { groupController } from "./group";
import { PersistedEntityInternal } from "../../models/internal/common";

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
 * Helper type for media item sorting conditions
 */
type OrderBy = Sortable<MediaItemInternal>;

/**
 * Controller for media item entities
 */
class MediaItemController extends AbstractEntityController {

	/**
	 * Gets a single media item, or undefined if not found
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param mediaItemId media item ID
	 */
	public getMediaItem(userId: string, categoryId: string, mediaItemId: string): Promise<MediaItemInternal | undefined> {

		const conditions: QueryConditions = {
			_id: mediaItemId,
			category: categoryId,
			owner: userId
		};

		return queryHelper.findOne(MediaItemModel, conditions);
	}

	/**
	 * Gets all saved media items for the given user and category, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getAllMediaItems(userId: string, categoryId: string): Promise<MediaItemInternal[]> {

		const sortBy: MediaItemSortByInternal[] = [{
			field: MediaItemSortFieldInternal.NAME,
			ascending: true
		}];

		return this.filterAndOrderMediaItems(userId, categoryId, undefined, sortBy);
	}

	/**
	 * Gets all saved media items for the given group, as a promise
	 * @param groupId the group ID
	 */
	public getAllMediaItemsInGroup(groupId: string): Promise<MediaItemInternal[]> {

		const conditions: QueryConditions = {
			group: groupId
		};

		return queryHelper.find(MediaItemModel, conditions);
	}

	/**
	 * Gets all saved media items for the given category, as a promise
	 * @param categoryId the category ID
	 */
	public getAllMediaItemsInCategory(categoryId: string): Promise<MediaItemInternal[]> {

		const conditions: QueryConditions = {
			category: categoryId
		};

		return queryHelper.find(MediaItemModel, conditions);
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

				let sortDirection: SortDirection = value.ascending ? 'asc' : 'desc';

				switch(value.field) {

					case MediaItemSortFieldInternal.IMPORTANCE:
						sort.importance = sortDirection;
						break;

					case MediaItemSortFieldInternal.AUTHOR:
						sort.author = sortDirection;
						break;

					case MediaItemSortFieldInternal.NAME:
						sort.name = sortDirection;
						break;

					case MediaItemSortFieldInternal.GROUP:
						sort.group = sortDirection;
						sort.orderInGroup = sortDirection;
						break;

					default:
						logger.error('Unexpected order by value: %s', value.field);
						throw AppError.GENERIC.withDetails('Unhandled orderBy value');
				}
			}
		}

		return queryHelper.find(MediaItemModel, conditions, sort, {'group': true});
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
	public async saveMediaItem(mediaItem: MediaItemInternal, allowSameName?: boolean): Promise<MediaItemInternal> {

		await this.checkWritePreconditions(
			AppError.DATABASE_SAVE.withDetails(mediaItem._id ? 'Media item or group does not exists for given user/category' : 'User or category or group does not exist'),
			mediaItem.owner,
			mediaItem.category,
			mediaItem.group,
			mediaItem._id);

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
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param mediaItemId the media item ID
	 */
	public async deleteMediaItem(userId: string, categoryId: string, mediaItemId: string): Promise<number> {

		await this.checkWritePreconditions(
			AppError.DATABASE_DELETE.withDetails('Media item does not exist for given user/category'),
			userId,
			categoryId,
			undefined,
			mediaItemId);

		return queryHelper.deleteById(MediaItemModel, mediaItemId);
	}

	/**
	 * Delets all saved media items for the given group, returning the number of deleted elements as a promise
	 * @param groupId the group ID
	 */
	public deleteAllMediaItemsInGroup(groupId: string): Promise<number> {

		const conditions: QueryConditions = {
			group: groupId
		};

		return queryHelper.delete(MediaItemModel, conditions);
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
		
		if(filterBy) {
			
			if(filterBy.importance) {

				conditions.importance = filterBy.importance;
			}

			if(filterBy.groupId) {

				conditions.group = filterBy.groupId;
			}
		}
	}

	/**
	 * Helper to check preconditions on a insert/update/delete method
	 * @param errorToThow error to throw if the preconditions fail
	 * @param user the user
	 * @param category the category
	 * @param group the group (optional)
	 * @param mediaItemId the media item ID (optional to use this method for new inserts)
	 */
	private checkWritePreconditions(errorToThow: AppError, user: string | UserInternal, category: string | CategoryInternal, group?: string | GroupInternal, mediaItemId?: string): Promise<void> {

		return this.checkExistencePreconditionsHelper(errorToThow, () => {

			const userId = typeof(user) === 'string' ? user : user._id;
			const categoryId = typeof(category) === 'string' ? category : category._id;
			const groupId = !group || typeof(group) === 'string' ? group : group._id;

			let mediaItemCheckPromise: Promise<PersistedEntityInternal | undefined>;

			if(mediaItemId) {

				// Make sure the media item exists
				mediaItemCheckPromise = this.getMediaItem(userId, categoryId, mediaItemId);
			}
			else {

				// Make sure the category exists
				mediaItemCheckPromise = categoryController.getCategory(userId, categoryId);
			}

			// If a group was set, also make sure the group exists
			if(groupId) {

				return Promise.all([
					groupController.getGroup(userId, categoryId, groupId),
					mediaItemCheckPromise
				]);
			}
			else {

				return mediaItemCheckPromise;
			}
		});
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


