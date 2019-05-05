import { Queryable, QueryHelper } from 'app/controllers/database/query-helper';
import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { AbstractEntityController } from 'app/controllers/entities/helper';
import { mediaItemFactory } from 'app/factories/media-item';
import { UserInternal } from 'app/models/internal/user';
import { UserSchema, USER_COLLECTION_NAME } from 'app/schemas/user';
import { miscUtils } from 'app/utilities/misc-utils';
import { Document, Model, model } from 'mongoose';
import { ownPlatformController } from './own-platform';

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

	private readonly queryHelper: QueryHelper<UserInternal, UserDocument, Model<UserDocument>>;

	/**
	 * Constructor
	 */
	public constructor() {

		super();
		this.queryHelper = new QueryHelper(UserModel);
	}

	/**
	 * Gets a single user, or undefined if not found
	 * @param userId user ID
	 */
	public getUser(userId: string): Promise<UserInternal | undefined> {

		const conditions: QueryConditions = {
			_id: userId
		};

		return this.queryHelper.findOne(conditions);
	}

	/**
	 * Saves a new or an existing user, returning it back as a promise
	 * @param user the user to insert or update
	 */
	public saveUser(user: UserInternal): Promise<UserInternal> {

		const conditions: QueryConditions = {
			name: user.name
		};
		return this.queryHelper.checkUniquenessAndSave(user, new UserModel(), conditions);
	}

	/**
	 * Deletes a user with the given ID, returning a promise with the number of deleted elements
	 * @param id the user ID
	 */
	public deleteUser(id: string): Promise<number> {
		
		// Delete all media item entities (with each controller)
		const mediaItemControllers = mediaItemFactory.getAllEntityControllers();
		const mediaItemPromises: Promise<number>[] = [];
		for(const mediaItemController of mediaItemControllers) {

			mediaItemPromises.push(mediaItemController.deleteAllMediaItemsForUser(id));
		}

		// Delete categories, groups and the user; and then wait for every delete promise
		return miscUtils.mergeAndSumPromiseResults(mediaItemPromises.concat([
			categoryController.deleteAllCategoriesForUser(id),
			groupController.deleteAllGroupsForUser(id),
			ownPlatformController.deleteAllOwnPlatformsForUser(id),
			this.queryHelper.deleteById(id)
		]));
	}
}

/**
 * Singleton implementation of the user controller
 */
export const userController = new UserController();

