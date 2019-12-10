import { Queryable, QueryHelper, Sortable } from 'app/controllers/database/query-helper';
import { categoryController } from 'app/controllers/entities/category';
import { AbstractEntityController } from 'app/controllers/entities/helper';
import { AppError } from 'app/data/models/error/error';
import { CategoryInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { UserInternal } from 'app/data/models/internal/user';
import { mediaItemFactory } from 'app/factories/media-item';
import { GroupSchema, GROUP_COLLECTION_NAME } from 'app/schemas/group';
import { miscUtils } from 'app/utilities/misc-utils';
import { Document, Model, model } from 'mongoose';

/**
 * Mongoose document for groups
 */
interface GroupDocument extends GroupInternal, Document {}

/**
 * Mongoose model for groups
 */
const GroupModel: Model<GroupDocument> = model<GroupDocument>(GROUP_COLLECTION_NAME, GroupSchema);

/**
 * Helper type for group query conditions
 */
type QueryConditions = Queryable<GroupInternal>;

/**
 * Helper type for group sorting conditions
 */
type OrderBy = Sortable<GroupInternal>;

/**
 * Controller for group entities
 */
class GroupController extends AbstractEntityController {

	private readonly queryHelper: QueryHelper<GroupInternal, GroupDocument, Model<GroupDocument>>;

	/**
	 * Constructor
	 */
	public constructor() {

		super();
		this.queryHelper = new QueryHelper(GroupModel);
	}

	/**
	 * Gets a single group, or undefined if not found
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param groupId gorup ID
	 */
	public getGroup(userId: string, categoryId: string, groupId: string): Promise<GroupInternal | undefined> {

		const conditions: QueryConditions = {
			_id: groupId,
			owner: userId,
			category: categoryId
		};

		return this.queryHelper.findOne(conditions);
	}
	
	/**
	 * Gets all saved groups for the given user and category, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getAllGroups(userId: string, categoryId: string): Promise<GroupInternal[]> {

		const conditions: QueryConditions = {
			owner: userId,
			category: categoryId
		};

		const sortBy: OrderBy = {
			name: 'asc'
		};

		return this.queryHelper.find(conditions, sortBy);
	}

	/**
	 * Saves a new or an existing group, returning it back as a promise
	 * @param group the group to insert or update
	 * @returns the saved group, as a promise
	 */
	public async saveGroup(group: GroupInternal): Promise<GroupInternal> {

		await this.checkWritePreconditions(
			AppError.DATABASE_SAVE.withDetails(group._id ? 'Group does not exists for given user/category' : 'User or category does not exist'),
			group.owner,
			group.category,
			group._id
		);
		
		return this.queryHelper.save(group, new GroupModel());
	}

	/**
	 * Deletes a group with the given ID
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param groupId the group ID
	 * @returns a promise with the number of deleted elements
	 */
	public async deleteGroup(userId: string, categoryId: string, groupId: string): Promise<number> {
		
		await this.checkWritePreconditions(AppError.DATABASE_DELETE.withDetails('Group does not exist for given user/category'), userId, categoryId, groupId);

		const mediaItemController = await mediaItemFactory.getEntityControllerFromCategoryId(userId, categoryId);

		return miscUtils.mergeAndSumPromiseResults([
			mediaItemController.deleteAllMediaItemsInGroup(groupId),
			this.queryHelper.deleteById(groupId)
		]);
	}

	/**
	 * Deletes all groups for the given category, returning the number of deleted elements as a promise
	 * This method does NOT cascade delete all media items in the groups
	 * @param categoryId category ID
	 */
	public deleteAllGroupsInCategory(categoryId: string): Promise<number> {

		const conditions: QueryConditions = {
			category: categoryId
		};

		return this.queryHelper.delete(conditions);
	}

	/**
	 * Deletes all groups for the given user, returning the number of deleted elements as a promise
	 * This method does NOT cascade delete all media items in the groups
	 * @param userId user ID
	 */
	public deleteAllGroupsForUser(userId: string): Promise<number> {

		const conditions: QueryConditions = {
			owner: userId
		};

		return this.queryHelper.delete(conditions);
	}

	/**
	 * Helper to check preconditions on a insert/update/delete method
	 * @param errorToThow error to throw if the preconditions fail
	 * @param user the user
	 * @param category the category
	 * @param groupId the group ID (optional to use this method for new inserts)
	 * @returns a promise that resolves if all preconditions are OK
	 */
	private checkWritePreconditions(errorToThow: AppError, user: string | UserInternal, category: string | CategoryInternal, groupId?: string): Promise<void> {

		return this.checkExistencePreconditionsHelper(errorToThow, () => {

			const userId = this.getEntityStringId(user);
			const categoryId = this.getEntityStringId(category);

			if(groupId) {

				// Make sure the group exists
				return this.getGroup(userId, categoryId, groupId);
			}
			else {

				// Make sure the category exists
				return categoryController.getCategory(userId, categoryId);
			}
		});
	}
}

/**
 * Singleton implementation of the group controller
 */
export const groupController = new GroupController();

