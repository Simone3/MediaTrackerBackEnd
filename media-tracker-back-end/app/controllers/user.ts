import { Document, Model, model } from "mongoose";
import { UserInternal } from "../models/internal/user";
import { UserSchema, USER_COLLECTION_NAME } from "../schemas/user";
import { AbstractModelController } from "./helper";
import { categoryController } from "./category";

/**
 * Mongoose document for users
 */
interface UserDocument extends UserInternal, Document {}

/**
 * Mongoose model for users
 */
const UserModel: Model<UserDocument> = model<UserDocument>(USER_COLLECTION_NAME, UserSchema);

/**
 * Controller for users, wraps the persistence logic
 */
class UserController extends AbstractModelController {

	/**
	 * Saves a new or an existing user, returning it back as a promise
	 * @param user the user to insert or update
	 */
	public saveUser(user: UserInternal): Promise<UserInternal> {

		return this.saveHelper(user, new UserModel(), 'User not found');
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
				return this.deleteByIdHelper(UserModel, id, 'User not found');
			});
	}
}

/**
 * Singleton implementation of the user controller
 */
export const userController = new UserController();


