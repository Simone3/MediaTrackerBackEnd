import { Queryable, QueryHelper, Sortable } from 'app/controllers/database/query-helper';
import { groupController } from 'app/controllers/entities/group';
import { AbstractEntityController } from 'app/controllers/entities/helper';
import { userController } from 'app/controllers/entities/user';
import { AppError } from 'app/data/models/error/error';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { UserInternal } from 'app/data/models/internal/user';
import { mediaItemFactory } from 'app/factories/media-item';
import { CategorySchema, CATEGORY_COLLECTION_NAME } from 'app/schemas/category';
import { miscUtils } from 'app/utilities/misc-utils';
import { Document, Model, model } from 'mongoose';
import { ownPlatformController } from './own-platform';

/**
 * Mongoose document for categories
 */
interface CategoryDocument extends CategoryInternal, Document {}

/**
 * Mongoose model for categories
 */
const CategoryModel: Model<CategoryDocument> = model<CategoryDocument>(CATEGORY_COLLECTION_NAME, CategorySchema);

/**
 * Helper type for category query conditions
 */
type QueryConditions = Queryable<CategoryInternal>;

/**
 * Helper type for category sorting conditions
 */
type OrderBy = Sortable<CategoryInternal>;

/**
 * Controller for category entities
 */
class CategoryController extends AbstractEntityController {

	private readonly queryHelper: QueryHelper<CategoryInternal, CategoryDocument, Model<CategoryDocument>>;

	/**
	 * Constructor
	 */
	public constructor() {

		super();
		this.queryHelper = new QueryHelper(CategoryModel);
	}

	/**
	 * Gets a single category, or undefined if not found
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getCategory(userId: string, categoryId: string): Promise<CategoryInternal | undefined> {

		const conditions: QueryConditions = {
			_id: categoryId,
			owner: userId
		};

		return this.queryHelper.findOne(conditions);
	}

	/**
	 * Gets all saved categories for the given user, as a promise
	 * @param userId user ID
	 */
	public getAllCategories(userId: string): Promise<CategoryInternal[]> {

		const conditions: QueryConditions = {
			owner: userId
		};

		const sortBy: OrderBy = {
			name: 'asc'
		};

		return this.queryHelper.find(conditions, sortBy);
	}

	/**
	 * Saves a new or an existing category, returning it back as a promise
	 * @param category the category to insert or update
	 * @returns the saved category, as a promise
	 */
	public async saveCategory(category: CategoryInternal): Promise<CategoryInternal> {
		
		await this.checkWritePreconditions(
			AppError.DATABASE_SAVE.withDetails(category._id ? 'Category does not exists for given user' : 'User does not exist'),
			category.owner,
			category._id,
			category
		);
		
		return this.queryHelper.save(category, new CategoryModel());
	}

	/**
	 * Deletes a category with the given ID, returning a promise with the number of deleted elements
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @returns the number of deleted categories, as a promise
	 */
	public async deleteCategory(userId: string, categoryId: string): Promise<number> {

		await this.checkWritePreconditions(AppError.DATABASE_DELETE.withDetails('Category does not exist for given user'), userId, categoryId);

		const mediaItemController = await mediaItemFactory.getEntityControllerFromCategoryId(userId, categoryId);

		return miscUtils.mergeAndSumPromiseResults([
			groupController.deleteAllGroupsInCategory(categoryId),
			mediaItemController.deleteAllMediaItemsInCategory(categoryId),
			ownPlatformController.deleteAllOwnPlatformsInCategory(categoryId),
			this.queryHelper.deleteById(categoryId)
		]);
	}

	/**
	 * Deletes all categories for the given user, returning the number of deleted elements as a promise
	 * This method does NOT cascade delete all media items/groups in the categories
	 * @param userId user ID
	 */
	public deleteAllCategoriesForUser(userId: string): Promise<number> {

		const conditions: QueryConditions = {
			owner: userId
		};

		return this.queryHelper.delete(conditions);
	}

	/**
	 * Helper to check preconditions on a insert/update/delete method
	 * @param errorToThow error to throw if the preconditions fail
	 * @param user the user
	 * @param categoryId the category ID (optional to use this method for new inserts)
	 * @param newCategoryData the new data that will be saved if preconditions are OK (optional to use this method for deletes)
	 * @returns a void promise that resolves if all preconditions are OK
	 */
	private async checkWritePreconditions(errorToThow: AppError, user: string | UserInternal, categoryId?: string, newCategoryData?: CategoryInternal): Promise<void> {

		const userId = this.getEntityStringId(user);

		// Preconditions are different when it's a new category or an existing one
		if(categoryId) {

			// First check that the category exists
			const categoryCheckPromise = this.getCategory(userId, categoryId);
			await this.checkExistencePreconditionsHelper(errorToThow, () => {
				return categoryCheckPromise;
			});

			// Then, if the media type changes, check that the category is empty
			const category = await categoryCheckPromise;
			if(category && newCategoryData && category.mediaType !== newCategoryData.mediaType) {

				const mediaItemController = await mediaItemFactory.getEntityControllerFromCategoryId(userId, categoryId);
				const mediaItems: MediaItemInternal[] = await mediaItemController.getAllMediaItemsInCategory(categoryId);
				if(mediaItems.length > 0) {

					throw AppError.DATABASE_SAVE.withDetails('Cannot change category media type if it contains media items');
				}
			}
		}
		else {

			// Make sure the user exists
			await this.checkExistencePreconditionsHelper(errorToThow, () => {
				return userController.getUser(userId);
			});
		}
	}
}

/**
 * Singleton implementation of the category controller
 */
export const categoryController = new CategoryController();

