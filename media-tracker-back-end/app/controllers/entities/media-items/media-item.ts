import { Document, Model } from "mongoose";
import { MediaItemInternal, MediaItemFilterInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal, MediaItemSortFieldInternal } from "../../../models/internal/media-items/media-item";
import { Queryable, Sortable, queryHelper, SortDirection, Populatable } from "../../database/query-helper";
import { miscUtilsController } from "../../utilities/misc-utils";
import { AppError } from "../../../models/error/error";
import { logger } from "../../../loggers/logger";
import { AbstractEntityController } from "../helper";
import { UserInternal } from "app/models/internal/user";
import { CategoryInternal } from "app/models/internal/category";
import { GroupInternal } from "app/models/internal/group";
import { categoryController } from "../category";
import { groupController } from "../group";
import { PersistedEntityInternal } from "../../../models/internal/common";

/**
 * Abstract controller for media item entities
 * @template E the media item entity
 * @template S the media item sort conditions 
 * @template F the media item filter conditions
 */
export abstract class MediaItemEntityController<E extends MediaItemInternal, S extends MediaItemSortByInternal, F extends MediaItemFilterInternal> extends AbstractEntityController {

	/**
	 * Gets a single media item, or undefined if not found
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param mediaItemId media item ID
	 */
	public getMediaItem(userId: string, categoryId: string, mediaItemId: string): Promise<E | undefined> {

		const conditions: Queryable<E> = {};
		conditions._id = mediaItemId;
		conditions.category = categoryId;
		conditions.owner = userId;
		
		return queryHelper.findOne(this.getModelType(), conditions);
	}

	/**
	 * Gets all saved media items for the given user and category, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getAllMediaItems(userId: string, categoryId: string): Promise<E[]> {

		const sortBy: S[] = this.getDefaultSortBy();

		return this.filterAndOrderMediaItems(userId, categoryId, undefined, sortBy);
	}

	/**
	 * Gets all saved media items for the given group, as a promise
	 * @param groupId the group ID
	 */
	public getAllMediaItemsInGroup(groupId: string): Promise<E[]> {

		const conditions: Queryable<E> = {};
		conditions.group = groupId;

		return queryHelper.find(this.getModelType(), conditions);
	}

	/**
	 * Gets all saved media items for the given category, as a promise
	 * @param categoryId the category ID
	 */
	public getAllMediaItemsInCategory(categoryId: string): Promise<E[]> {

		const conditions: Queryable<E> = {};
		conditions.category = categoryId;
		
		return queryHelper.find(this.getModelType(), conditions);
	}

	/**
	 * Gets all media items matching the given filter and ordered with the given ordering options, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param filterBy filter options
	 * @param orderBy sort otions
	 */
	public filterAndOrderMediaItems(userId: string, categoryId: string, filterBy?: F, sortBy?: S[]): Promise<E[]> {

		const conditions: Queryable<E> = {};
		conditions.owner = userId;
		conditions.category = categoryId;
		this.setConditionsFromFilter(conditions, filterBy);

		const sortConditions: Sortable<E> = {};
		if(sortBy) {

			for(const value of sortBy) {

				let sortDirection: SortDirection = value.ascending ? 'asc' : 'desc';
				this.setSortConditions(value, sortDirection, sortConditions);
			}
		}

		const populate: Populatable<E> = {};
		populate.group = true;

		return queryHelper.find(this.getModelType(), conditions, sortConditions, populate);
	}

	/**
	 * Searches media items by term, returning the results divided in two lists: those matching the given filters and those not matching them
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param term the search term
	 * @param filterBy the optional filters
	 */
	public searchMediaItems(userId: string, categoryId: string, term: string, filterBy?: F): Promise<E[]> {

		const termRegExp = new RegExp(miscUtilsController.escapeRegExp(term), 'i');
		
		// Common search conditions
		const searchConditions: Queryable<E>[] = [];
		const nameCondition: Queryable<E> = {};
		nameCondition.name = termRegExp;
		searchConditions.push(nameCondition);

		// Specific search conditions
		this.setSearchByTermConditions(term, termRegExp, searchConditions);

		// Complete query conditions
		const conditions: Queryable<E> = {};
		conditions.owner = userId,
		conditions.category = categoryId,
		conditions.$or = searchConditions;
		this.setConditionsFromFilter(conditions, filterBy);

		// Sort
		const sortBy: Sortable<E> = {};
		sortBy.name = 'asc';

		return queryHelper.find(this.getModelType(), conditions, sortBy);
	}

	/**
	 * Saves a new or an existing media item, returning it back as a promise
	 * @param mediaItem the media item to insert or update
	 * @param allowSameName whether to check or not if an existing category has the same name
	 */
	public async saveMediaItem(mediaItem: E, allowSameName?: boolean): Promise<E> {

		await this.checkWritePreconditions(
			AppError.DATABASE_SAVE.withDetails(mediaItem._id ? 'Media item or group does not exists for given user/category' : 'User or category or group does not exist'),
			mediaItem.owner,
			mediaItem.category,
			mediaItem.group,
			mediaItem._id);

		if(allowSameName) {

			logger.debug('Same name is allowed');
			return queryHelper.save(mediaItem, this.getNewEmptyDocument());
		}
		else {

			logger.debug('Same name is NOT allowed');

			const conditions: Queryable<E> = {};
			conditions.owner = mediaItem.owner;
			conditions.category = mediaItem.category;
			conditions.name = mediaItem.name;
			
			return queryHelper.checkUniquenessAndSave(this.getModelType(), mediaItem, this.getNewEmptyDocument(), conditions);
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

		return queryHelper.deleteById(this.getModelType(), mediaItemId);
	}

	/**
	 * Delets all saved media items for the given group, returning the number of deleted elements as a promise
	 * @param groupId the group ID
	 */
	public deleteAllMediaItemsInGroup(groupId: string): Promise<number> {

		const conditions: Queryable<E> = {};
		conditions.group = groupId;

		return queryHelper.delete(this.getModelType(), conditions);
	}

	/**
	 * Deletes all media items for the given category, returning the number of deleted elements as a promise
	 * @param categoryId category ID
	 */
	public deleteAllMediaItemsInCategory(categoryId: string): Promise<number> {

		const conditions: Queryable<E> = {};
		conditions.category = categoryId;

		return queryHelper.delete(this.getModelType(), conditions);
	}

	/**
	 * Deletes all media items for the given user, returning the number of deleted elements as a promise
	 * @param userId user ID
	 */
	public deleteAllMediaItemsForUser(userId: string): Promise<number> {

		const conditions: Queryable<E> = {};
		conditions.owner = userId;

		return queryHelper.delete(this.getModelType(), conditions);
	}

	/**
	 * Must be implemented by subclasses to define the default (e.g. for the "get all media items" API) sort conditions
	 * @returns at least one sort condition
	 */
	protected abstract getDefaultSortBy(): S[];

	/**
	 * Must be implemented by subclasses to define the Mongoose model linked with the media item
	 * @returns the Mongoose model
	 */
	protected abstract getModelType(): Model<E & Document>;

	/**
	 * Must be implemented by subclasses to provide an empty Mongoose document of the linked model
	 * @returns an empty Mongoose document
	 */
	protected abstract getNewEmptyDocument(): E & Document;

	/**
	 * Must be implemented by subclasses to set the correct sort condition from a sortBy object. Implementations can call setCommonSortConditions()
	 * to handle the sortBy values common to all media items.
	 * @param sortBy the source sort object
	 * @param sortDirection the pre-computed sort direction to be assigned to the sort field
	 * @param sortConditions the sort conditions where the sortDirection should be set according to the sortBy value
	 */
	protected abstract setSortConditions(sortBy: S, sortDirection: SortDirection, sortConditions: Sortable<MediaItemInternal>): void;

	/**
	 * Must be implemented by subclasses to (possibly) add more search conditions for the "search media item" API
	 * @param term the search term
	 * @param termRegExp the pre-computed RegExp of the search term
	 * @param searchConditions the common search conditions where the implementation can push other fields
	 */
	protected abstract setSearchByTermConditions(term: string, termRegExp: RegExp, searchConditions: Queryable<E>[]): void;

	/**
	 * Helper for subclasses that can be called during setSortConditions() to handle the sortBy values common to all media items.
	 * @param sortByField the source sort field
	 * @param sortDirection the pre-computed sort direction to be assigned to the sort field
	 * @param sortConditions the sort conditions where the sortDirection should be set according to the sortBy value
	 */
	protected setCommonSortConditions(sortByField: MediaItemSortFieldInternal, sortDirection: SortDirection, sortConditions: Sortable<MediaItemInternal>): void {

		switch(sortByField) {

			case 'IMPORTANCE':
				sortConditions.importance = sortDirection;
				break;

			case 'NAME':
				sortConditions.name = sortDirection;
				break;

			case 'GROUP':
				sortConditions.group = sortDirection;
				sortConditions.orderInGroup = sortDirection;
				break;

			default:
				logger.error('Unexpected order by value: %s', sortByField);
				throw AppError.GENERIC.withDetails('Unhandled orderBy value');
		}
	}

	/**
	 * Helper to set the query conditions based on the given filters
	 */
	private setConditionsFromFilter(conditions: Queryable<E>, filterBy?: F): void {
		
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
}


