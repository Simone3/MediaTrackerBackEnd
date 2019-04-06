import { Document, Model, model } from "mongoose";
import { UserInternal } from "../../models/internal/user";
import { UserSchema, USER_COLLECTION_NAME } from "../../schemas/user";
import { categoryController } from "./category";
import { queryHelper, Queryable } from "../database/query-helper";

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
class UserController {

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
	 * Deletes a user with the given ID, returning a void promise
	 * @param id the user ID
	 */
	public deleteUser(id: string): Promise<void> {
		
		// First delete all user categories
		return categoryController.deleteAllCategories(id)
			.then(() => {

				// Then delete user
				return queryHelper.deleteById(UserModel, id);
			});
	}
}

/**
 * Singleton implementation of the user controller
 */
export const userController = new UserController();


