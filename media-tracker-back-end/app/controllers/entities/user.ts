import { Document, Model, model } from "mongoose";
import { UserInternal } from "../../models/internal/user";
import { UserSchema, USER_COLLECTION_NAME } from "../../schemas/user";
import { categoryController } from "./category";
import { queryHelper, Queryable } from "../database/query-helper";
import { AbstractEntityController } from "./helper";
import { groupController } from "./group";
import { mediaItemController } from "./media-items/media-item";

/**
 * Mongoose document for users
 */
interface UserDocument extends UserInternal, Document {}

/**
 * Mongoose model for users
 */
const UserModel: Model<UserDocument> = model<UserDocument>(USER_COLLECTION_NAME, UserSchema);

/**
 * Helper type for user query conditions
 */
type QueryConditions = Queryable<UserInternal>;

/**
 * Controller for user entities
 */
class UserController extends AbstractEntityController {

	/**
	 * Gets a single user, or undefined if not found
	 * @param userId user ID
	 */
	public getUser(userId: string): Promise<UserInternal | undefined> {

		const conditions: QueryConditions = {
			_id: userId
		};

		return queryHelper.findOne(UserModel, conditions);
	}

	/**
	 * Saves a new or an existing user, returning it back as a promise
	 * @param user the user to insert or update
	 */
	public saveUser(user: UserInternal): Promise<UserInternal> {

		const conditions: QueryConditions = {
			name: user.name
		};
		return queryHelper.checkUniquenessAndSave(UserModel, user, new UserModel(), conditions);
	}

	/**
	 * Deletes a user with the given ID, returning a promise with the number of deleted elements
	 * @param id the user ID
	 * @param forceEvenIfNotEmpty forces delete even if not empty (deletes all categories, groups and media items inside it)
	 */
	public deleteUser(id: string, forceEvenIfNotEmpty: boolean): Promise<number> {
		
		return this.cleanupWithEmptyCheck(forceEvenIfNotEmpty, () => {
			return categoryController.getAllCategories(id)
		}, () => {
			return Promise.all([
				categoryController.deleteAllCategoriesForUser(id),
				groupController.deleteAllGroupsForUser(id),
				mediaItemController.deleteAllMediaItemsForUser(id),
				queryHelper.deleteById(UserModel, id)
			])
		});
	}
}

/**
 * Singleton implementation of the user controller
 */
export const userController = new UserController();


