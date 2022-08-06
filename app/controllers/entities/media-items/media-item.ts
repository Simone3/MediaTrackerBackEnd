import { Populatable, QueryHelper, Sortable } from 'app/controllers/database/query-helper';
import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { AbstractEntityController } from 'app/controllers/entities/helper';
import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { AppError } from 'app/data/models/error/error';
import { CategoryInternal, MediaTypeInternal } from 'app/data/models/internal/category';
import { PersistedEntityInternal } from 'app/data/models/internal/common';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { logger } from 'app/loggers/logger';
import { miscUtils } from 'app/utilities/misc-utils';
import { Document, FilterQuery, Model, SortOrder, UpdateQuery } from 'mongoose';

/**
 * Abstract controller for media item entities
 * @template TMediaItemInternal the media item entity
 * @template TMediaItemSortByInternal the media item sort conditions
 * @template TMediaItemFilterInternal the media item filter conditions
 */
export abstract class MediaItemEntityController<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> extends AbstractEntityController {

	private readonly queryHelper: QueryHelper<TMediaItemInternal, Document & TMediaItemInternal, Model<Document & TMediaItemInternal>>;

	/**
	 * Constructor
	 * @param model the source DB model
	 */
	protected constructor(model: Model<Document & TMediaItemInternal>) {

		super();
		this.queryHelper = new QueryHelper(model);
	}

	/**
	 * Gets a single media item
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param mediaItemId media item ID
	 * @returns the media item or undefined if not found, as a promise
	 */
	public getMediaItem(userId: string, categoryId: string, mediaItemId: string): Promise<TMediaItemInternal | undefined> {

		const conditions: FilterQuery<MediaItemInternal> = {
			_id: mediaItemId,
			category: categoryId,
			owner: userId
		};
		
		return this.queryHelper.findOne(this.castFilterQuery(conditions));
	}

	/**
	 * Gets all saved media items for the given user and category
	 * @param userId user ID
	 * @param categoryId category ID
	 * @returns the retrieved media items, as a promise
	 */
	public getAllMediaItems(userId: string, categoryId: string): Promise<TMediaItemInternal[]> {

		const sortBy: TMediaItemSortByInternal[] = this.getDefaultSortBy();

		return this.filterAndOrderMediaItems(userId, categoryId, undefined, sortBy);
	}

	/**
	 * Gets all saved media items for the given group
	 * @param groupId the group ID
	 * @returns the media items, as a promise
	 */
	public getAllMediaItemsInGroup(groupId: string): Promise<TMediaItemInternal[]> {

		const conditions: FilterQuery<MediaItemInternal> = {
			group: groupId
		};

		return this.queryHelper.find(this.castFilterQuery(conditions));
	}

	/**
	 * Gets all saved media items linked to the given own platform
	 * @param ownPlatformId the own platform ID
	 * @returns the media items, as a promise
	 */
	public getAllMediaItemsInOwnPlatform(ownPlatformId: string): Promise<TMediaItemInternal[]> {

		const conditions: FilterQuery<MediaItemInternal> = {
			ownPlatform: ownPlatformId
		};

		return this.queryHelper.find(this.castFilterQuery(conditions));
	}

	/**
	 * Gets all saved media items for the given category
	 * @param categoryId the category ID
	 * @returns the media items, as a promise
	 */
	public getAllMediaItemsInCategory(categoryId: string): Promise<TMediaItemInternal[]> {

		const conditions: FilterQuery<MediaItemInternal> = {
			category: categoryId
		};
		
		return this.queryHelper.find(this.castFilterQuery(conditions));
	}

	/**
	 * Gets all media items matching the given filter and ordered with the given ordering options
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param filterBy filter options
	 * @param sortBy sort otions
	 * @returns the media items, as a promise
	 */
	public filterAndOrderMediaItems(userId: string, categoryId: string, filterBy?: TMediaItemFilterInternal, sortBy?: TMediaItemSortByInternal[]): Promise<TMediaItemInternal[]> {

		const andConditions: FilterQuery<MediaItemInternal>[] = [];
		this.addConditionsFromFilter(userId, categoryId, this.castFilterQueryArray(andConditions), filterBy);
		const conditions: FilterQuery<MediaItemInternal> = {
			$and: andConditions
		};

		const sortConditions: Sortable<TMediaItemInternal> = {};
		if(sortBy) {

			for(const value of sortBy) {

				const sortDirection: SortOrder = value.ascending ? 'asc' : 'desc';
				this.setSortConditions(value, sortDirection, sortConditions);
			}
		}

		return this.queryHelper.find(this.castFilterQuery(conditions), sortConditions, this.getPopulateAll());
	}

	/**
	 * Searches media items by term, returning the results divided in two lists: those matching the given filters and those not matching them
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param term the search term
	 * @param filterBy the optional filters
	 * @returns the media items, as a promise
	 */
	public searchMediaItems(userId: string, categoryId: string, term: string, filterBy?: TMediaItemFilterInternal): Promise<TMediaItemInternal[]> {

		const termRegExp = new RegExp(miscUtils.escapeRegExp(term), 'i');
		
		// Common search conditions
		const searchConditions: FilterQuery<MediaItemInternal>[] = [];
		const nameCondition: FilterQuery<MediaItemInternal> = {
			name: termRegExp
		};
		searchConditions.push(nameCondition);

		// Specific search conditions
		this.setSearchByTermConditions(term, termRegExp, this.castFilterQueryArray(searchConditions));
		
		// Complete query conditions, with active filter
		const andConditions: FilterQuery<MediaItemInternal>[] = [];
		this.addConditionsFromFilter(userId, categoryId, this.castFilterQueryArray(andConditions), filterBy);
		andConditions.push({
			$or: searchConditions
		});
		const conditions: FilterQuery<MediaItemInternal> = {
			$and: andConditions
		};

		// Sort
		const sortBy: Sortable<TMediaItemInternal> = {};
		sortBy.name = 'asc';

		return this.queryHelper.find(this.castFilterQuery(conditions), sortBy, this.getPopulateAll());
	}

	/**
	 * Saves a new or an existing media item
	 * @param mediaItem the media item to insert or update
	 * @param skipCheckPreconditions if true, skips existance preconditions
	 * @returns the saved media item, as a promise
	 */
	public async saveMediaItem(mediaItem: TMediaItemInternal, skipCheckPreconditions?: boolean): Promise<TMediaItemInternal> {

		if(!skipCheckPreconditions) {
			
			await this.checkWritePreconditions(
				AppError.DATABASE_SAVE.withDetails(mediaItem._id ? 'Media item or group or own platform does not exist for given user/category' : 'User or category or group or own platform does not exist'),
				mediaItem.owner,
				mediaItem.category,
				mediaItem.group,
				mediaItem.ownPlatform,
				mediaItem._id
			);
		}
		
		return this.queryHelper.save(mediaItem, this.getNewEmptyDocument());
	}

	/**
	 * Deletes a media item with the given ID
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param mediaItemId the media item ID
	 * @returns the number of deleted media items, as a promise
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
	 * Delets all saved media items for the given group
	 * @param groupId the group ID
	 * @returns the number of deleted elements as a promise
	 */
	public deleteAllMediaItemsInGroup(groupId: string): Promise<number> {

		const conditions: FilterQuery<MediaItemInternal> = {
			group: groupId
		};

		return this.queryHelper.delete(this.castFilterQuery(conditions));
	}

	/**
	 * Deletes all media items for the given category
	 * @param categoryId category ID
	 * @returns the number of deleted elements as a promise
	 */
	public deleteAllMediaItemsInCategory(categoryId: string): Promise<number> {

		const conditions: FilterQuery<MediaItemInternal> = {
			category: categoryId
		};

		return this.queryHelper.delete(this.castFilterQuery(conditions));
	}

	/**
	 * Deletes all media items for the given user
	 * @param userId user ID
	 * @returns the number of deleted elements as a promise
	 */
	public deleteAllMediaItemsForUser(userId: string): Promise<number> {

		const conditions: FilterQuery<MediaItemInternal> = {
			owner: userId
		};

		return this.queryHelper.delete(this.castFilterQuery(conditions));
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

		const set: UpdateQuery<MediaItemInternal> = {
			ownPlatform: newOwnPlatformId
		};

		const conditions: FilterQuery<MediaItemInternal> = {
			owner: userId,
			category: categoryId
		};

		if(oldOwnPlatformId instanceof Array) {

			conditions.ownPlatform = { $in: oldOwnPlatformId };
		}
		else {

			conditions.ownPlatform = oldOwnPlatformId;
		}
		
		return this.queryHelper.updateSelectiveMany(this.castUpdateQuery(set), this.castFilterQuery(conditions));
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
	protected abstract getNewEmptyDocument(): Document & TMediaItemInternal;

	/**
	 * Must be implemented by subclasses to set the correct sort condition from a sortBy object. Implementations can call setCommonSortConditions()
	 * to handle the sortBy values common to all media items.
	 * @param sortBy the source sort object
	 * @param sortDirection the pre-computed sort direction to be assigned to the sort field
	 * @param sortConditions the sort conditions where the sortDirection should be set according to the sortBy value
	 */
	protected abstract setSortConditions(sortBy: TMediaItemSortByInternal, sortDirection: SortOrder, sortConditions: Sortable<TMediaItemInternal>): void;

	/**
	 * Must be implemented by subclasses to add search conditions for the 'filter media item' API. Implementations can call addCommonConditionsFromFilter()
	 * to handle the filter values common to all media items.
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param andConditions the target array of AND conditions
	 * @param filterBy the optional source filters
	 */
	protected abstract addConditionsFromFilter(userId: string, categoryId: string, andConditions: FilterQuery<Document & TMediaItemInternal>[], filterBy?: TMediaItemFilterInternal): void;

	/**
	 * Must be implemented by subclasses to (possibly) add more search conditions for the 'search media item' API
	 * @param term the search term
	 * @param termRegExp the pre-computed RegExp of the search term
	 * @param searchConditions the common search conditions where the implementation can push other fields
	 */
	protected abstract setSearchByTermConditions(term: string, termRegExp: RegExp, searchConditions: FilterQuery<Document & TMediaItemInternal>[]): void;

	/**
	 * Must be implemented by subclasses to define the linked media type
	 * @returns the linked media type
	 */
	protected abstract getLinkedMediaType(): MediaTypeInternal;

	/**
	 * Helper for subclasses that can be called during addConditionsFromFilter() to handle the filter values common to all media items.
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param andConditions the target array of AND conditions
	 * @param filterBy the optional source filters
	 */
	protected addCommonConditionsFromFilter(userId: string, categoryId: string, andConditions: FilterQuery<MediaItemInternal>[], filterBy?: MediaItemFilterInternal): void {
		
		andConditions.push({
			owner: userId,
			category: categoryId
		});

		if(filterBy) {
			
			if(filterBy.importanceLevels && filterBy.importanceLevels.length > 0) {

				andConditions.push({
					importance: {
						$in: filterBy.importanceLevels
					}
				});
			}

			if(filterBy.complete !== undefined && filterBy.complete !== null) {

				if(filterBy.complete) {

					andConditions.push({
						completedLastOn: {
							$ne: undefined
						},
						markedAsRedo: {
							$ne: true
						}
					});
				}
				else {

					andConditions.push({
						$or: [{
							completedLastOn: undefined
						}, {
							markedAsRedo: true
						}]
					});
				}
			}

			if(filterBy.name) {

				// Case insensitive exact match
				andConditions.push({
					name: new RegExp(`^${filterBy.name}$`, 'i')
				});
			}

			if(filterBy.groups) {

				if(filterBy.groups.groupIds && filterBy.groups.groupIds.length > 0) {

					andConditions.push({
						group: {
							$in: filterBy.groups.groupIds
						}
					});
				}
				else {

					const any = filterBy.groups.anyGroup;
					const no = filterBy.groups.noGroup;
					if(any && !no) {
						
						andConditions.push({
							group: {
								$ne: undefined
							}
						});
					}
					else if(!any && no) {

						andConditions.push({
							group: undefined
						});
					}
				}
			}

			if(filterBy.ownPlatforms) {

				if(filterBy.ownPlatforms.ownPlatformIds && filterBy.ownPlatforms.ownPlatformIds.length > 0) {

					andConditions.push({
						ownPlatform: {
							$in: filterBy.ownPlatforms.ownPlatformIds
						}
					});
				}
				else {

					const any = filterBy.ownPlatforms.anyOwnPlatform;
					const no = filterBy.ownPlatforms.noOwnPlatform;
					if(any && !no) {
						
						andConditions.push({
							ownPlatform: {
								$ne: undefined
							}
						});
					}
					else if(!any && no) {

						andConditions.push({
							ownPlatform: undefined
						});
					}
				}
			}
		}
	}

	/**
	 * Helper for subclasses that can be called during setSortConditions() to handle the sortBy values common to all media items.
	 * @param sortByField the source sort field
	 * @param sortDirection the pre-computed sort direction to be assigned to the sort field
	 * @param sortConditions the sort conditions where the sortDirection should be set according to the sortBy value
	 */
	protected setCommonSortConditions(sortByField: MediaItemSortFieldInternal, sortDirection: SortOrder, sortConditions: Sortable<TMediaItemInternal>): void {

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

			case 'COMPLETION_DATE':
				sortConditions.completedLastOn = sortDirection;
				break;

			case 'ACTIVE':
				sortConditions.active = sortDirection;
				break;

			case 'RELEASE_DATE':
				sortConditions.releaseDate = sortDirection;
				break;

			default:
				logger.error('Unexpected order by value: %s', sortByField);
				throw AppError.GENERIC.withDetails('Unhandled orderBy value');
		}
	}

	/**
	 * Helper to get the "populate" options for linked entities
	 * @returns the "populate" options
	 */
	protected getPopulateAll(): Populatable<TMediaItemInternal> {

		const populate: Populatable<TMediaItemInternal> = {};
		populate.group = true;
		populate.ownPlatform = true;
		return populate;
	}

	/**
	 * Helper to check preconditions on a insert/update/delete method
	 * @param errorToThow error to throw if the preconditions fail
	 * @param userId the user
	 * @param category the category
	 * @param group the group (optional)
	 * @param ownPlatform the own platform (optional)
	 * @param mediaItemId the media item ID (optional to use this method for new inserts)
	 * @returns a void promise that resolves if all preconditions are OK
	 */
	private checkWritePreconditions(errorToThow: AppError, userId: string, category: string | CategoryInternal, group?: string | GroupInternal, ownPlatform?: string | OwnPlatformInternal, mediaItemId?: string): Promise<void> {

		return new Promise((resolve, reject): void => {

			this.checkExistencePreconditionsHelper(errorToThow, () => {

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

	/**
	 * As per https://github.com/DefinitelyTyped/DefinitelyTyped/issues/39358 FilterQuery does not work with generics, as intended.
	 * Since here I know subclasses won't cause any problem, I can safely cast the object.
	 * @param conditions source
	 * @returns cast source
	 */
	private castFilterQuery(conditions: FilterQuery<MediaItemInternal>): FilterQuery<Document & TMediaItemInternal> {

		return conditions as FilterQuery<Document & TMediaItemInternal>;
	}
	
	private castFilterQueryArray(conditions: FilterQuery<MediaItemInternal>[]): FilterQuery<Document & TMediaItemInternal>[] {

		return conditions as FilterQuery<Document & TMediaItemInternal>[];
	}

	private castUpdateQuery(set: UpdateQuery<MediaItemInternal>): UpdateQuery<Document & TMediaItemInternal> {

		return set as UpdateQuery<Document & TMediaItemInternal>;
	}
}

