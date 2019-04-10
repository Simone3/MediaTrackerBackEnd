import { Document, Model, model } from "mongoose";
import { GroupInternal } from "../../models/internal/group";
import { GroupSchema, GROUP_COLLECTION_NAME } from "../../schemas/group";
import { Queryable, queryHelper } from "../database/query-helper";
import { logger } from "../../loggers/logger";

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
 * Controller for group entities
 */
class GroupController {

	/**
	 * Gets all saved groups for the given user, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getAllGroups(userId: string, categoryId: string): Promise<GroupInternal[]> {

		const conditions: QueryConditions = {
			owner: userId,
			category: categoryId
		};

		return queryHelper.find(GroupModel, conditions);
	}

	/**
	 * Saves a new or an existing group, returning it back as a promise
	 * @param group the group to insert or update
	 * @param allowSameName whether to check or not if an existing group has the same name
	 */
	public saveGroup(group: GroupInternal, allowSameName?: boolean): Promise<GroupInternal> {

		if(allowSameName) {

			logger.debug('Same name is allowed');
			return queryHelper.save(group, new GroupModel());
		}
		else {

			logger.debug('Same name is NOT allowed');
			const conditions: QueryConditions = {
				owner: group.owner,
				category: group.category,
				name: group.name
			};
			return queryHelper.checkUniquenessAndSave(GroupModel, group, new GroupModel(), conditions);
		}
	}

	/**
	 * Deletes a group with the given ID, returning a void promise
	 * @param id the group ID
	 */
	public deleteGroup(id: string): Promise<void> {

		// TODO uncomment this!
		// logger.debug('First delete all media items in the group');
		// return mediaItemController.deleteAllMediaItemsInGroup(id)
		// 	.then(() => {

				logger.debug('Then delete the group');
				return queryHelper.deleteById(GroupModel, id)
			// });
	}

	// /**
	//  * Deletes all groups for the given category, returning the number of deleted elements as a promise
	//  * @param categoryId category ID
	//  */
	// public deleteAllGroupsInCategory(categoryId: string): Promise<number> {

	// 	const conditions: QueryConditions = {
	// 		category: categoryId
	// 	};

	// 	return queryHelper.delete(GroupModel, conditions);
	// }

	// /**
	//  * Deletes all groups for the given user, returning the number of deleted elements as a promise
	//  * @param userId user ID
	//  */
	// public deleteAllGroupsForUser(userId: string): Promise<number> {

	// 	THIS IS WRONG...
	// 	logger.debug('First delete all user categories (and thus media items)');
	// 	return categoryController.deleteAllCategories(userId)
	// 		.then(() => {

	// 			const conditions: QueryConditions = {
	// 				owner: userId
	// 			};

	// 			logger.debug('Then delete all groups');
	// 			return queryHelper.delete(GroupModel, conditions);
	// 		})
	// }
}

/**
 * Singleton implementation of the group controller
 */
export const groupController = new GroupController();


