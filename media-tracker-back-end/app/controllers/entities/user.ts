import { Document, Model, model } from "mongoose";
import { UserInternal } from "../../models/internal/user";
import { UserSchema, USER_COLLECTION_NAME } from "../../schemas/user";
import { categoryController } from "./category";
import { queryHelper } from "../database/query-helper";

/**
 * Mongoose document for users
 */
interface UserDocument extends UserInternal, Document {}

/**
 * Mongoose model for users
 */
const UserModel: Model<UserDocument> = model<UserDocument>(USER_COLLECTION_NAME, UserSchema);

/**
 * Controller for user entities
 */
class UserController {

	/**
	 * Saves a new or an existing user, returning it back as a promise
	 * @param user the user to insert or update
	 */
	public saveUser(user: UserInternal): Promise<UserInternal> {

		return queryHelper.save(user, new UserModel(), 'User not found');
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
				return queryHelper.deleteById(UserModel, id, 'User not found');
			});
	}
}

/**
 * Singleton implementation of the user controller
 */
export const userController = new UserController();


