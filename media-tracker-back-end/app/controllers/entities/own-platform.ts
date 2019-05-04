import { Queryable, QueryHelper, Sortable } from 'app/controllers/database/query-helper';
import { categoryController } from 'app/controllers/entities/category';
import { AbstractEntityController } from 'app/controllers/entities/helper';
import { mediaItemFactory } from 'app/factories/media-item';
import { AppError } from 'app/models/error/error';
import { CategoryInternal } from 'app/models/internal/category';
import { OwnPlatformInternal } from 'app/models/internal/own-platform';
import { UserInternal } from 'app/models/internal/user';
import { OwnPlatformSchema, OWN_PLATFORM_COLLECTION_NAME } from 'app/schemas/own-platform';
import { miscUtils } from 'app/utilities/misc-utils';
import { Document, Model, model } from 'mongoose';

/**
 * Mongoose document for own platforms
 */
interface OwnPlatformDocument extends OwnPlatformInternal, Document {}

/**
 * Mongoose model for own platforms
 */
const OwnPlatformModel: Model<OwnPlatformDocument> = model<OwnPlatformDocument>(OWN_PLATFORM_COLLECTION_NAME, OwnPlatformSchema);

/**
 * Helper type for own platform query conditions
 */
type QueryConditions = Queryable<OwnPlatformInternal>;

/**
 * Helper type for own platform sorting conditions
 */
type OrderBy = Sortable<OwnPlatformInternal>;

/**
 * Controller for own platform entities
 */
class OwnPlatformController extends AbstractEntityController {

	private readonly queryHelper: QueryHelper<OwnPlatformInternal, OwnPlatformDocument, Model<OwnPlatformDocument>>;

	/**
	 * Constructor
	 */
	public constructor() {

		super();
		this.queryHelper = new QueryHelper(OwnPlatformModel);
	}

	/**
	 * Gets a single own platform, or undefined if not found
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param ownPlatformId gorup ID
	 */
	public getOwnPlatform(userId: string, categoryId: string, ownPlatformId: string): Promise<OwnPlatformInternal | undefined> {

		const conditions: QueryConditions = {
			_id: ownPlatformId,
			owner: userId,
			category: categoryId
		};

		return this.queryHelper.findOne(conditions);
	}
	
	/**
	 * Gets all saved own platforms for the given user and category, as a promise
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getAllOwnPlatforms(userId: string, categoryId: string): Promise<OwnPlatformInternal[]> {

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
	 * Saves a new or an existing own platform, returning it back as a promise
	 * @param ownPlatform the own platform to insert or update
	 */
	public async saveOwnPlatform(ownPlatform: OwnPlatformInternal): Promise<OwnPlatformInternal> {

		await this.checkWritePreconditions(
			AppError.DATABASE_SAVE.withDetails(ownPlatform._id ? 'Own platform does not exists for given user/category' : 'User or category does not exist'),
			ownPlatform.owner,
			ownPlatform.category,
			ownPlatform._id
		);

		return this.queryHelper.save(ownPlatform, new OwnPlatformModel());
	}

	/**
	 * Deletes a own platform with the given ID
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param ownPlatformId the own platform ID
	 * @param forceEvenIfNotEmpty forces delete even if not empty (deletes all media items inside it)
	 * @returns a promise with the number of deleted elements
	 */
	public async deleteOwnPlatform(userId: string, categoryId: string, ownPlatformId: string): Promise<number> {
		
		await this.checkWritePreconditions(AppError.DATABASE_DELETE.withDetails('OwnPlatform does not exist for given user/category'), userId, categoryId, ownPlatformId);
		
		const mediaItemController = await mediaItemFactory.getEntityControllerFromCategoryId(userId, categoryId);

		return miscUtils.mergeAndSumPromiseResults(
			this.queryHelper.deleteById(ownPlatformId),
			mediaItemController.replaceOwnPlatformInAllMediaItems(userId, categoryId, ownPlatformId, undefined)
		);
	}

	/**
	 * Deletes all own platforms for the given category, returning the number of deleted elements as a promise
	 * This method does NOT cascade delete all media items in the own platforms
	 * @param categoryId category ID
	 */
	public deleteAllOwnPlatformsInCategory(categoryId: string): Promise<number> {

		const conditions: QueryConditions = {
			category: categoryId
		};

		return this.queryHelper.delete(conditions);
	}

	/**
	 * Deletes all own platforms for the given user, returning the number of deleted elements as a promise
	 * This method does NOT cascade delete all media items in the own platforms
	 * @param userId user ID
	 */
	public deleteAllOwnPlatformsForUser(userId: string): Promise<number> {

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
	 * @param ownPlatformId the own platform ID (optional to use this method for new inserts)
	 */
	private checkWritePreconditions(errorToThow: AppError, user: string | UserInternal, category: string | CategoryInternal, ownPlatformId?: string): Promise<void> {

		return this.checkExistencePreconditionsHelper(errorToThow, () => {

			const userId = typeof user === 'string' ? user : user._id;
			const categoryId = typeof category === 'string' ? category : category._id;

			if(ownPlatformId) {

				// Make sure the platform exists
				return this.getOwnPlatform(userId, categoryId, ownPlatformId);
			}
			else {

				// Make sure the category exists
				return categoryController.getCategory(userId, categoryId);
			}
		});
	}
}

/**
 * Singleton implementation of the own platform controller
 */
export const ownPlatformController = new OwnPlatformController();

