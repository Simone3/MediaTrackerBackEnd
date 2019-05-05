import { Populatable, Queryable, QueryHelper, Sortable, SortDirection } from 'app/controllers/database/query-helper';
import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { AbstractEntityController } from 'app/controllers/entities/helper';
import { logger } from 'app/loggers/logger';
import { AppError } from 'app/models/error/error';
import { CategoryInternal, MediaTypeInternal } from 'app/models/internal/category';
import { PersistedEntityInternal } from 'app/models/internal/common';
import { GroupInternal } from 'app/models/internal/group';
import { MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal } from 'app/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/models/internal/own-platform';
import { UserInternal } from 'app/models/internal/user';
import { miscUtils } from 'app/utilities/misc-utils';
import { Document, Model } from 'mongoose';
import { ownPlatformController } from '../own-platform';

/**
 * Abstract controller for media item entities
 * @template TMediaItemInternal the media item entity
 * @template TMediaItemSortByInternal the media item sort conditions
 * @template TMediaItemFilterInternal the media item filter conditions
 */
export abstract class MediaItemEntityController<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> extends AbstractEntityController {

	private readonly queryHelper: QueryHelper<TMediaItemInternal, TMediaItemInternal & Document, Model<TMediaItemInternal & Document>>;

	/**
	 * Constructor
	 */
	protected constructor(model: Model<TMediaItemInternal & Document>) {

		super();
		this.queryHelper = new QueryHelper(model);
	}

	/**
	 * Gets a single media item, or undefined if not found
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param mediaItemId media item ID
	 */
	public getMediaItem(userId: string, categoryId: string, mediaItemId: string): Promise<TMediaItemInternal | undefined> {

		const conditions: Queryable<TMediaItemInternal> = {};
		conditions._id = mediaItemId;
		conditions.category = categoryId;
		conditions.owner = userId;
		
		return this.queryHelper.findOne(conditions);
	}

	/**
	 * Gets all saved media items for the given user and category, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getAllMediaItems(userId: string, categoryId: string): Promise<TMediaItemInternal[]> {

		const sortBy: TMediaItemSortByInternal[] = this.getDefaultSortBy();

		return this.filterAndOrderMediaItems(userId, categoryId, undefined, sortBy);
	}

	/**
	 * Gets all saved media items for the given group, as a promise
	 * @param groupId the group ID
	 */
	public getAllMediaItemsInGroup(groupId: string): Promise<TMediaItemInternal[]> {

		const conditions: Queryable<TMediaItemInternal> = {};
		conditions.group = groupId;

		return this.queryHelper.find(conditions);
	}

	/**
	 * Gets all saved media items linked to the given own platform, as a promise
	 * @param ownPlatformId the own platform ID
	 */
	public getAllMediaItemsInOwnPlatform(ownPlatformId: string): Promise<TMediaItemInternal[]> {

		const conditions: Queryable<TMediaItemInternal> = {};
		conditions.ownPlatform = ownPlatformId;

		return this.queryHelper.find(conditions);
	}

	/**
	 * Gets all saved media items for the given category, as a promise
	 * @param categoryId the category ID
	 */
	public getAllMediaItemsInCategory(categoryId: string): Promise<TMediaItemInternal[]> {

		const conditions: Queryable<TMediaItemInternal> = {};
		conditions.category = categoryId;
		
		return this.queryHelper.find(conditions);
	}

	/**
	 * Gets all media items matching the given filter and ordered with the given ordering options, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param filterBy filter options
	 * @param orderBy sort otions
	 */
	public filterAndOrderMediaItems(userId: string, categoryId: string, filterBy?: TMediaItemFilterInternal, sortBy?: TMediaItemSortByInternal[]): Promise<TMediaItemInternal[]> {

		const conditions: Queryable<TMediaItemInternal> = {};
		conditions.owner = userId;
		conditions.category = categoryId;
		this.setConditionsFromFilter(conditions, filterBy);

		const sortConditions: Sortable<TMediaItemInternal> = {};
		if(sortBy) {

			for(const value of sortBy) {

				const sortDirection: SortDirection = value.ascending ? 'asc' : 'desc';
				this.setSortConditions(value, sortDirection, sortConditions);
			}
		}

		return this.queryHelper.find(conditions, sortConditions, this.getPopulateAll());
	}

	/**
	 * Searches media items by term, returning the results divided in two lists: those matching the given filters and those not matching them
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param term the search term
	 * @param filterBy the optional filters
	 */
	public searchMediaItems(userId: string, categoryId: string, term: string, filterBy?: TMediaItemFilterInternal): Promise<TMediaItemInternal[]> {

		const termRegExp = new RegExp(miscUtils.escapeRegExp(term), 'i');
		
		// Common search conditions
		const searchConditions: Queryable<TMediaItemInternal>[] = [];
		const nameCondition: Queryable<TMediaItemInternal> = {};
		nameCondition.name = termRegExp;
		searchConditions.push(nameCondition);

		// Specific search conditions
		this.setSearchByTermConditions(term, termRegExp, searchConditions);

		// Complete query conditions
		const conditions: Queryable<TMediaItemInternal> = {};
		conditions.owner = userId;
		conditions.category = categoryId;
		conditions.$or = searchConditions;
		this.setConditionsFromFilter(conditions, filterBy);

		// Sort
		const sortBy: Sortable<TMediaItemInternal> = {};
		sortBy.name = 'asc';

		return this.queryHelper.find(conditions, sortBy, this.getPopulateAll());
	}

	/**
	 * Saves a new or an existing media item, returning it back as a promise
	 * @param mediaItem the media item to insert or update
	 * @param allowSameName whether to check or not if an existing category has the same name
	 */
	public async saveMediaItem(mediaItem: TMediaItemInternal, allowSameName?: boolean): Promise<TMediaItemInternal> {

		await this.checkWritePreconditions(
			AppError.DATABASE_SAVE.withDetails(mediaItem._id ? 'Media item or group does not exists for given user/category' : 'User or category or group does not exist'),
			mediaItem.owner,
			mediaItem.category,
			mediaItem.group,
			mediaItem.ownPlatform,
			mediaItem._id
		);

		if(allowSameName) {

			logger.debug('Same name is allowed');
			return this.queryHelper.save(mediaItem, this.getNewEmptyDocument());
		}
		else {

			logger.debug('Same name is NOT allowed');

			const conditions: Queryable<TMediaItemInternal> = {};
			conditions.owner = mediaItem.owner;
			conditions.category = mediaItem.category;
			conditions.name = mediaItem.name;
			
			return this.queryHelper.checkUniquenessAndSave(mediaItem, this.getNewEmptyDocument(), conditions);
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
			undefined,
			mediaItemId
		);

		return this.queryHelper.deleteById(mediaItemId);
	}

	/**
	 * Delets all saved media items for the given group, returning the number of deleted elements as a promise
	 * @param groupId the group ID
	 */
	public deleteAllMediaItemsInGroup(groupId: string): Promise<number> {

		const conditions: Queryable<TMediaItemInternal> = {};
		conditions.group = groupId;

		return this.queryHelper.delete(conditions);
	}

	/**
	 * Deletes all media items for the given category, returning the number of deleted elements as a promise
	 * @param categoryId category ID
	 */
	public deleteAllMediaItemsInCategory(categoryId: string): Promise<number> {

		const conditions: Queryable<TMediaItemInternal> = {};
		conditions.category = categoryId;

		return this.queryHelper.delete(conditions);
	}

	/**
	 * Deletes all media items for the given user, returning the number of deleted elements as a promise
	 * @param userId user ID
	 */
	public deleteAllMediaItemsForUser(userId: string): Promise<number> {

		const conditions: Queryable<TMediaItemInternal> = {};
		conditions.owner = userId;

		return this.queryHelper.delete(conditions);
	}

	/**
	 * Replaces an own platform in all media items in the given category
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param oldOwnPlatformId the old own platform
	 * @param newOwnPlatformId the new own platform
	 * @returns the number of updated media items, as a promise
	 */
	public replaceOwnPlatformInAllMediaItems(userId: string, categoryId: string, oldOwnPlatformId: string | string[], newOwnPlatformId: string | undefined): Promise<number> {

		const set: Partial<TMediaItemInternal> = {};
		set.ownPlatform = newOwnPlatformId;

		const conditions: Queryable<TMediaItemInternal> = {};
		conditions.owner = userId;
		conditions.category = categoryId;

		if(oldOwnPlatformId instanceof Array) {

			conditions.ownPlatform = { $in: oldOwnPlatformId };
		}
		else {

			conditions.ownPlatform = oldOwnPlatformId;
		}
		
		return this.queryHelper.updateSelectiveMany(set, conditions);
	}

	/**
	 * Must be implemented by subclasses to define the default (e.g. for the 'get all media items' API) sort conditions
	 * @returns at least one sort condition
	 */
	protected abstract getDefaultSortBy(): TMediaItemSortByInternal[];

	/**
	 * Must be implemented by subclasses to provide an empty Mongoose document of the linked model
	 * @returns an empty Mongoose document
	 */
	protected abstract getNewEmptyDocument(): TMediaItemInternal & Document;

	/**
	 * Must be implemented by subclasses to set the correct sort condition from a sortBy object. Implementations can call setCommonSortConditions()
	 * to handle the sortBy values common to all media items.
	 * @param sortBy the source sort object
	 * @param sortDirection the pre-computed sort direction to be assigned to the sort field
	 * @param sortConditions the sort conditions where the sortDirection should be set according to the sortBy value
	 */
	protected abstract setSortConditions(sortBy: TMediaItemSortByInternal, sortDirection: SortDirection, sortConditions: Sortable<TMediaItemInternal>): void;

	/**
	 * Must be implemented by subclasses to (possibly) add more search conditions for the 'search media item' API
	 * @param term the search term
	 * @param termRegExp the pre-computed RegExp of the search term
	 * @param searchConditions the common search conditions where the implementation can push other fields
	 */
	protected abstract setSearchByTermConditions(term: string, termRegExp: RegExp, searchConditions: Queryable<TMediaItemInternal>[]): void;

	/**
	 * Must be implemented by subclasses to define the linked media type
	 * @returns the linked media type
	 */
	protected abstract getLinkedMediaType(): MediaTypeInternal;

	/**
	 * Helper for subclasses that can be called during setSortConditions() to handle the sortBy values common to all media items.
	 * @param sortByField the source sort field
	 * @param sortDirection the pre-computed sort direction to be assigned to the sort field
	 * @param sortConditions the sort conditions where the sortDirection should be set according to the sortBy value
	 */
	protected setCommonSortConditions(sortByField: MediaItemSortFieldInternal, sortDirection: SortDirection, sortConditions: Sortable<TMediaItemInternal>): void {

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

			case 'OWN_PLATFORM':
				sortConditions.ownPlatform = sortDirection;
				break;

			default:
				logger.error('Unexpected order by value: %s', sortByField);
				throw AppError.GENERIC.withDetails('Unhandled orderBy value');
		}
	}

	/**
	 * Helper to get the "populate" options for linked entities
	 * @retuns the "populate" options
	 */
	protected getPopulateAll(): Populatable<TMediaItemInternal> {

		const populate: Populatable<TMediaItemInternal> = {};
		populate.group = true;
		populate.ownPlatform = true;
		return populate;
	}

	/**
	 * Helper to set the query conditions based on the given filters
	 */
	private setConditionsFromFilter(conditions: Queryable<TMediaItemInternal>, filterBy?: TMediaItemFilterInternal): void {
		
		if(filterBy) {
			
			if(filterBy.importance) {

				conditions.importance = filterBy.importance;
			}

			if(filterBy.groupId) {

				conditions.group = filterBy.groupId;
			}

			if(filterBy.ownPlatformId) {
				
				conditions.ownPlatform = filterBy.ownPlatformId;
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
	private checkWritePreconditions(errorToThow: AppError, user: string | UserInternal, category: string | CategoryInternal, group?: string | GroupInternal, ownPlatform?: string | OwnPlatformInternal, mediaItemId?: string): Promise<void> {

		return new Promise((resolve, reject): void => {

			this.checkExistencePreconditionsHelper(errorToThow, () => {

				const userId = this.getEntityStringId(user);
				const categoryId = this.getEntityStringId(category);
				const groupId = group ? this.getEntityStringId(group) : undefined;
				const ownPlatformId = ownPlatform ? this.getEntityStringId(ownPlatform) : undefined;

				const checkPromises: Promise<PersistedEntityInternal | undefined>[] = [];

				// Preconditions are different when it's a new media item or an existing one
				if(mediaItemId) {

					// Make sure the media item exists
					checkPromises.push(this.getMediaItem(userId, categoryId, mediaItemId));
				}
				else {

					// Get the category
					const categoryCheckPromise = categoryController.getCategory(userId, categoryId);

					// Check that media item and category media types are compatible (first then())
					categoryCheckPromise.then((retrievedCategory) => {

						if(retrievedCategory && retrievedCategory.mediaType !== this.getLinkedMediaType()) {

							reject(AppError.DATABASE_SAVE.withDetails('Media item and category have incompatible media types'));
						}
					});

					// Check that the category actually exists (second then(), handled by checkExistencePreconditionsHelper())
					checkPromises.push(categoryCheckPromise);
				}

				// If a group was set, also make sure the group exists
				if(groupId) {

					checkPromises.push(groupController.getGroup(userId, categoryId, groupId));
				}

				// If an own platform was set, also make sure the platform exists
				if(ownPlatformId) {

					checkPromises.push(ownPlatformController.getOwnPlatform(userId, categoryId, ownPlatformId));
				}

				return Promise.all(checkPromises);
			})
				.then(() => {

					resolve();
				})
				.catch((error) => {

					reject(error);
				});
		});
	}
}

